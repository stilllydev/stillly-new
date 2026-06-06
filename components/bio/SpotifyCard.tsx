"use client";

import { useEffect, useState } from "react";
import type { LanyardSpotify } from "@/lib/lanyard";

/** Spotify "now playing" with a live progress bar. */
export default function SpotifyCard({ spotify }: { spotify: LanyardSpotify }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const { start, end } = spotify.timestamps;
  const total = Math.max(1, end - start);
  const elapsed = Math.min(total, Math.max(0, now - start));
  const pct = (elapsed / total) * 100;
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface-2)] p-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={spotify.album_art_url}
        alt={`${spotify.album} cover`}
        className="h-14 w-14 rounded-lg object-cover grayscale"
        width={56}
        height={56}
      />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-wider text-[color:var(--color-fg-faint)]">
          <span className="inline-block h-2 w-2 rounded-full bg-white" /> Listening on Spotify
        </p>
        <p className="truncate text-sm font-medium text-white">{spotify.song}</p>
        <p className="truncate text-xs text-[color:var(--color-fg-dim)]">by {spotify.artist}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] text-[color:var(--color-fg-faint)]">
            {fmt(elapsed)}
          </span>
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-[family-name:var(--font-mono)] text-[0.6rem] text-[color:var(--color-fg-faint)]">
            {fmt(total)}
          </span>
        </div>
      </div>
    </div>
  );
}
