"use client";

import { useState } from "react";

export default function Humanizer() {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [showVoice, setShowVoice] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setErr(null);
    setResult("");
    try {
      const res = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceSample: voice }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const field =
    "w-full rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4 outline-none transition-colors focus:border-white";

  return (
    <div className="space-y-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder="Paste AI-sounding text here…"
        className={field}
      />

      <button
        onClick={() => setShowVoice((v) => !v)}
        className="font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-dim)] hover:text-white"
      >
        {showVoice ? "− hide voice match" : "+ match my voice (optional)"}
      </button>
      {showVoice && (
        <textarea
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          rows={4}
          placeholder="Paste a sample of your own writing to mimic its voice…"
          className={field}
        />
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={run}
          disabled={loading || !text.trim()}
          className="rounded-full bg-white px-7 py-3 font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
        >
          {loading ? "Humanizing…" : "Humanize"}
        </button>
        <span className="font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-faint)]">
          {text.length} chars
        </span>
      </div>

      {err && <p className="text-sm text-red-400">{err}</p>}

      {result && (
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[color:var(--color-fg-faint)]">
              Humanized
            </span>
            <button
              onClick={copy}
              className="rounded-full border border-[color:var(--color-line)] px-3 py-1 text-xs hover:bg-white hover:text-black"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <p className="whitespace-pre-line leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
