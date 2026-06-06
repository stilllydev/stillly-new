"use client";

import { useEffect, useRef } from "react";

/**
 * Monochrome custom cursor: a smoothed follow-ring + an instant dot.
 * Uses mix-blend-mode: difference so it reads on both black and white.
 * Bails out entirely on touch / coarse-pointer devices and reduced motion.
 */
export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.body.classList.add("cursor-ready");
    const ring = ringRef.current!;
    const dot = dotRef.current!;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let dx = rx;
    let dy = ry;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    };

    const isInteractive = (el: Element | null) =>
      !!el?.closest("a, button, [data-magnetic], input, textarea, select, [role='button']");

    const onOver = (e: MouseEvent) => {
      ring.classList.toggle("is-hover", isInteractive(e.target as Element));
    };

    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("cursor-ready");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
