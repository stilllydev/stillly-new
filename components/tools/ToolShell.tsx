import Link from "next/link";
import type { ReactNode } from "react";

/** Consistent frame for the hidden utility pages. */
export default function ToolShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Link
        href="/"
        className="font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-faint)] hover:text-white"
      >
        stillly.xyz
      </Link>
      <p className="mt-8 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--color-fg-faint)]">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-[color:var(--color-fg-dim)]">{intro}</p>
      <div className="mt-10">{children}</div>
    </main>
  );
}
