"use client";

import { useState, useCallback } from "react";
import type { SourceReport } from "@/lib/source-rubric";

function Gauge({ score }: { score: number }) {
  const s = Math.max(0, Math.min(100, score));
  return (
    <div className="flex items-center gap-4">
      <div className="relative grid h-24 w-24 place-items-center">
        <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.5"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${(s / 100) * 97.4} 97.4`}
          />
        </svg>
        <span className="absolute font-[family-name:var(--font-display)] text-2xl font-bold">{s}</span>
      </div>
      <div>
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[color:var(--color-fg-faint)]">
          Reliability
        </p>
        <p className="text-lg font-semibold">
          {s >= 70 ? "Generally reliable" : s >= 40 ? "Mixed — verify" : "Low — be skeptical"}
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[color:var(--color-line)] py-2 text-sm last:border-0">
      <span className="text-[color:var(--color-fg-faint)]">{label}</span>
      <span className="text-right font-medium capitalize">{value}</span>
    </div>
  );
}

export default function SourceChecker() {
  const [mode, setMode] = useState<"url" | "image">("url");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [report, setReport] = useState<SourceReport | null>(null);

  const onImageFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onPaste = (e: React.ClipboardEvent) => {
    const file = Array.from(e.clipboardData.files)[0];
    if (file?.type.startsWith("image/")) onImageFile(file);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) onImageFile(file);
  };

  const run = async () => {
    setLoading(true);
    setErr(null);
    setReport(null);
    try {
      const res = await fetch("/api/check-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "url" ? { url } : { image }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setReport(data.report);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const canRun = mode === "url" ? url.trim().length > 3 : !!image;

  return (
    <div className="space-y-5">
      <div className="inline-flex rounded-full border border-[color:var(--color-line)] p-1">
        {(["url", "image"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-5 py-1.5 text-sm capitalize transition-colors ${
              mode === m ? "bg-white text-black" : "text-[color:var(--color-fg-dim)]"
            }`}
          >
            {m === "url" ? "Article URL" : "Image"}
          </button>
        ))}
      </div>

      {mode === "url" ? (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/news/article"
          className="w-full rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4 outline-none focus:border-white"
        />
      ) : (
        <div
          onPaste={onPaste}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          tabIndex={0}
          className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5 text-center outline-none focus:border-white"
        >
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="to analyze" className="max-h-48 rounded-lg object-contain" />
          ) : (
            <p className="text-sm text-[color:var(--color-fg-dim)]">
              Paste a screenshot, drag &amp; drop an image, or
              <label className="ml-1 cursor-pointer underline">
                browse
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && onImageFile(e.target.files[0])}
                />
              </label>
            </p>
          )}
        </div>
      )}

      <button
        onClick={run}
        disabled={loading || !canRun}
        className="rounded-full bg-white px-7 py-3 font-medium text-black transition-colors hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? "Analyzing…" : "Check reliability"}
      </button>

      {err && <p className="text-sm text-red-400">{err}</p>}

      {report && (
        <div className="space-y-5 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] p-6">
          {report.title && <p className="font-[family-name:var(--font-display)] text-lg font-semibold">{report.title}</p>}
          <Gauge score={report.reliability_score} />
          <p className="leading-relaxed text-[color:var(--color-fg-dim)]">{report.rationale}</p>

          <div className="rounded-xl border border-[color:var(--color-line)] p-4">
            <Row label="Source type" value={`${report.source_type}`} />
            <Row label="Author" value={report.has_author ? report.author_name ?? "named" : "anonymous"} />
            <Row label="Citations" value={report.citation_strength} />
            <Row label="Recency" value={`${report.recency}${report.publication_date ? ` · ${report.publication_date}` : ""}`} />
            <Row label="Domain reputation" value={report.domain_reputation} />
            <Row label="Bias" value={report.bias} />
            <Row label="Type" value={report.is_opinion ? "opinion / editorial" : "reporting"} />
          </div>

          {report.flags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {report.flags.map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-red-500/30 px-3 py-1 font-[family-name:var(--font-mono)] text-[0.7rem] text-red-300"
                >
                  {f.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          )}

          {report.recommendations?.length > 0 && (
            <div>
              <p className="mb-2 font-[family-name:var(--font-mono)] text-xs uppercase tracking-wider text-[color:var(--color-fg-faint)]">
                What to do
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-[color:var(--color-fg-dim)]">
                {report.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="font-[family-name:var(--font-mono)] text-[0.65rem] text-[color:var(--color-fg-faint)]">
            AI-generated assessment — a starting point for your own judgment, not a verdict.
          </p>
        </div>
      )}
    </div>
  );
}
