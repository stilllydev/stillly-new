"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/** Minimal "click to enter" splash. Shows once per session, then fades away. */
export default function EnterScreen() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem("entered")) setShow(true);
  }, []);

  const enter = () => {
    setLeaving(true);
    sessionStorage.setItem("entered", "1");
    window.dispatchEvent(new Event("site:enter"));
    setTimeout(() => setShow(false), 700);
  };

  if (!show) return null;

  return (
    <div
      onClick={enter}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && enter()}
      aria-label="Enter site"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="mb-6 animate-[spin_9s_linear_infinite] text-3xl">✦</div>
      <h1 className="mb-3 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight sm:text-3xl">
        {site.name}
      </h1>
      <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.35em] text-[color:var(--color-fg-faint)] animate-pulse">
        click to enter
      </p>
    </div>
  );
}
