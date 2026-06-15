import { NextResponse } from "next/server";
import { getGroq, GROQ_TEXT_MODEL, GROQ_VISION_MODEL } from "@/lib/groq";
import { SOURCE_SYSTEM_PROMPT, type SourceReport } from "@/lib/source-rubric";

export const runtime = "nodejs";
export const maxDuration = 45;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// Minimal HTML entity decode for the few that matter in extracted text.
function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
}

function metaValue(html: string, key: string): string | null {
  const re = new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]*>`, "i");
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  const c = tag.match(/content=["']([^"']*)["']/i);
  return c ? decode(c[1]).trim() : null;
}

/** Lightweight, dependency-free article extraction (serverless-safe). */
function extractArticle(html: string) {
  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = titleTag ? decode(titleTag).trim() : metaValue(html, "og:title");
  const byline =
    metaValue(html, "author") ||
    metaValue(html, "article:author") ||
    metaValue(html, "twitter:creator");
  const date =
    metaValue(html, "article:published_time") ||
    metaValue(html, "date") ||
    metaValue(html, "og:updated_time");
  const siteName = metaValue(html, "og:site_name");

  const body = decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
      .replace(/<head[\s\S]*?<\/head>/gi, " ")
      .replace(/<(nav|footer|header|aside|form)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

  return { title, byline, date, siteName, text: body.slice(0, 9000) };
}

function parseJson(content: string): SourceReport | null {
  const match = content.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as SourceReport;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const groq = getGroq();
  if (!groq) {
    return NextResponse.json({ error: "GROQ_API_KEY is not set." }, { status: 503 });
  }

  let body: { url?: string; image?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    let report: SourceReport | null = null;

    if (body.image) {
      const completion = await groq.chat.completions.create({
        model: GROQ_VISION_MODEL,
        temperature: 0.2,
        max_tokens: 1500,
        messages: [
          { role: "system", content: SOURCE_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: "Assess the reliability of the source shown in this image." },
              { type: "image_url", image_url: { url: body.image } },
            ],
          },
        ],
      });
      report = parseJson(completion.choices[0]?.message?.content ?? "");
    } else if (body.url) {
      let url = body.url.trim();
      if (!/^https?:\/\//i.test(url)) url = "https://" + url;

      let article: ReturnType<typeof extractArticle>;
      try {
        const res = await fetch(url, {
          headers: { "User-Agent": UA, Accept: "text/html" },
          redirect: "follow",
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        article = extractArticle(await res.text());
      } catch {
        return NextResponse.json(
          { error: "Couldn't fetch that URL — the site may be blocking bots. Try the image tab with a screenshot." },
          { status: 422 }
        );
      }

      const partial = article.text.length < 250;
      const completion = await groq.chat.completions.create({
        model: GROQ_TEXT_MODEL,
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SOURCE_SYSTEM_PROMPT },
          {
            role: "user",
            content: `URL: ${url}\nSite: ${article.siteName ?? "unknown"}\nTitle: ${article.title ?? "unknown"}\nByline: ${article.byline ?? "none found"}\nDate: ${article.date ?? "unknown"}\n\nArticle text${partial ? " (PARTIAL — may be paywalled/blocked)" : ""}:\n"""${article.text}"""`,
          },
        ],
      });
      report = parseJson(completion.choices[0]?.message?.content ?? "");
      if (report && partial) report.flags = [...(report.flags ?? []), "paywall_or_partial_text"];
    } else {
      return NextResponse.json({ error: "Provide a url or an image." }, { status: 400 });
    }

    if (!report) {
      return NextResponse.json({ error: "Could not analyze the source." }, { status: 502 });
    }
    return NextResponse.json({ report });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Analysis failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
