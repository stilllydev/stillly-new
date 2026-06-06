"use client";

import { useRef, useState } from "react";
import type { Game } from "@/lib/games";

export default function GamePlayer({ games }: { games: Game[] }) {
  const [active, setActive] = useState<Game | null>(null);
  const frameWrap = useRef<HTMLDivElement>(null);

  const goFullscreen = () => {
    const el = frameWrap.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.().catch(() => {});
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <article
            key={g.slug}
            className="flex flex-col rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-5"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">{g.title}</h3>
              <span className="font-[family-name:var(--font-mono)] text-[0.6rem] uppercase text-[color:var(--color-fg-faint)]">
                {g.license}
              </span>
            </div>
            <p className="mt-2 flex-1 text-sm text-[color:var(--color-fg-dim)]">{g.blurb}</p>
            <div className="mt-4 flex items-center gap-2">
              {g.available ? (
                <button
                  onClick={() => setActive(g)}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
                >
                  Play ▶
                </button>
              ) : (
                <span className="rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm text-[color:var(--color-fg-faint)]">
                  Not installed yet
                </span>
              )}
              <a
                href={g.source}
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-dim)] hover:text-white"
              >
                source ↗
              </a>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="rounded-2xl border border-[color:var(--color-line)] bg-black p-3">
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="font-[family-name:var(--font-display)] font-semibold">{active.title}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={goFullscreen}
                className="rounded-full border border-[color:var(--color-line)] px-3 py-1.5 text-xs hover:bg-white hover:text-black"
              >
                ⛶ Fullscreen
              </button>
              <button
                onClick={() => setActive(null)}
                className="rounded-full border border-[color:var(--color-line)] px-3 py-1.5 text-xs hover:bg-white hover:text-black"
              >
                ✕ Close
              </button>
            </div>
          </div>
          <div ref={frameWrap} className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
              key={active.slug}
              src={`/games/${active.slug}/index.html`}
              title={active.title}
              className="h-full w-full"
              allow="fullscreen; autoplay; gamepad"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock"
            />
          </div>
        </div>
      )}
    </div>
  );
}
