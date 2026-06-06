import Groq from "groq-sdk";

/** Server-only Groq client. Never import this into a client component. */
export function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new Groq({ apiKey });
}

// Recommended models (see plan). Override via env if Groq's catalog shifts.
export const GROQ_TEXT_MODEL =
  process.env.GROQ_TEXT_MODEL ?? "llama-3.3-70b-versatile";
export const GROQ_VISION_MODEL =
  process.env.GROQ_VISION_MODEL ?? "meta-llama/llama-4-maverick-17b-128e-instruct";
