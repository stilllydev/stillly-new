import { NextResponse } from "next/server";
import { getGroq, GROQ_TEXT_MODEL } from "@/lib/groq";
import { buildHumanizerMessages } from "@/lib/humanizer-prompt";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: Request) {
  const groq = getGroq();
  if (!groq) {
    return NextResponse.json({ error: "GROQ_API_KEY is not set." }, { status: 503 });
  }

  let body: { text?: string; voiceSample?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  if (!text) return NextResponse.json({ error: "No text provided." }, { status: 400 });
  if (text.length > 12000) {
    return NextResponse.json({ error: "Text too long (max ~12k chars)." }, { status: 413 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_TEXT_MODEL,
      temperature: 0.85,
      max_tokens: 4096,
      messages: buildHumanizerMessages(text, body.voiceSample),
    });
    const result = completion.choices[0]?.message?.content ?? "";
    return NextResponse.json({ result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Humanize failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
