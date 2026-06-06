import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { getGroq, GROQ_TEXT_MODEL, GROQ_VISION_MODEL } from "@/lib/groq";
import { SOURCE_SYSTEM_PROMPT, type SourceReport } from "@/lib/source-rubric";

export const runtime = "nodejs";
export const maxDuration = 45;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function extractArticle(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`Fetch failed (${res.status}). The site may block bots.`);
  const html = await res.text();
  const dom = new JSDOM(html, { url });
  const article = new Readability(dom.window.document).parse();
  return {
    title: article?.title ?? null,
    byline: article?.byline ?? null,
    text: (article?.textContent ?? "").trim().slice(0, 9000),
    siteName: article?.siteName ?? null,
  };
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
      // Image (data URI) -> vision model does OCR + layout understanding.
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
      const article = await extractArticle(url);
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
            content: `URL: ${url}\nSite: ${article.siteName ?? "unknown"}\nTitle: ${article.title ?? "unknown"}\nByline: ${article.byline ?? "none found"}\n\nArticle text${partial ? " (PARTIAL — may be paywalled/blocked)" : ""}:\n"""${article.text}"""`,
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
