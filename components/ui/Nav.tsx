"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const links = [
  { href: "/#bio", label: "Bio" },
  { href: "/portfolio", label: "Work" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 transition-all duration-400 sm:px-10 ${
        scrolled ? "bg-black/60 backdrop-blur-xl border-b border-[color:var(--color-line)]" : ""
      }`}
    >
      <Link
        href="/"
        className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-bold tracking-tight"
      >
        <span className="text-white">✦</span>
        {site.name}
      </Link>

      <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="rounded-full px-4 py-2 text-sm text-[color:var(--color-fg-dim)] transition-colors hover:text-white"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-line)] sm:hidden"
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className="text-lg">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full mx-4 mt-2 flex flex-col gap-1 rounded-2xl glass p-3 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-[color:var(--color-fg-dim)] hover:bg-[color:var(--color-surface-2)] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
