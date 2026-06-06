"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ObjectScene = dynamic(() => import("@/three/ObjectScene"), { ssr: false });

/**
 * A full-width section whose 3D form slides in from one side and out the other
 * as the user scrolls past it. Text sits opposite the form.
 */
export default function ScrollScene({
  side = "left",
  shape = "knot",
  eyebrow,
  title,
  children,
}: {
  side?: "left" | "right";
  shape?: "knot" | "ico";
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0.5); // 0 entering, 1 leaving

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section's top hits the bottom of the viewport, 1 when its bottom leaves the top
      const progress = 1 - (r.top + r.height / 2) / (vh + r.height / 2);
      setP(Math.max(0, Math.min(1, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // map progress 0..1 -> translateX from +/-60% (in) to -/+60% (out), opacity peaks mid
  const dir = side === "left" ? -1 : 1;
  const x = dir * (p - 0.5) * 120; // %
  const opacity = Math.sin(Math.PI * Math.max(0, Math.min(1, p))); // 0..1..0

  return (
    <section
      ref={ref}
      className="relative mx-auto grid min-h-[80vh] max-w-6xl grid-cols-1 items-center gap-8 px-5 py-24 sm:px-10 md:grid-cols-2"
    >
      <div className={side === "right" ? "md:order-2" : ""}>
        <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--color-fg-faint)]">
          {eyebrow}
        </p>
        <h2 className="mb-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="max-w-prose text-[color:var(--color-fg-dim)]">{children}</div>
      </div>
      <div
        className={`pointer-events-none h-[320px] sm:h-[420px] ${side === "right" ? "md:order-1" : ""}`}
        style={{ transform: `translateX(${x}%)`, opacity }}
      >
        <ObjectScene shape={shape} />
      </div>
    </section>
  );
}
