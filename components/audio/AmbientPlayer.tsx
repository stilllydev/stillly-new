"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Opt-in ambient audio. Off by default; a small fixed widget toggles it.
 * Drop a track at /public/audio/ambient.mp3 to enable.
 */
export default function AmbientPlayer({ src = "/audio/ambient.mp3" }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    // Probe whether the file exists so we can hide the widget if not.
    fetch(src, { method: "HEAD" })
      .then((r) => setAvailable(r.ok))
      .catch(() => setAvailable(false));
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        a.volume = 0.35;
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  if (!available) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Mute ambient audio" : "Play ambient audio"}
        aria-pressed={playing}
        className="fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full glass text-sm transition-transform hover:scale-105"
        title={playing ? "Mute" : "Play ambient sound"}
      >
        <span className="flex items-end gap-[2px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-[2px] rounded-full bg-white"
              style={{
                height: playing ? 14 : 6,
                animation: playing
                  ? `eq 0.9s ${i * 0.15}s ease-in-out infinite alternate`
                  : undefined,
              }}
            />
          ))}
        </span>
        <style>{`@keyframes eq { from { height: 4px } to { height: 16px } }`}</style>
      </button>
    </>
  );
}
