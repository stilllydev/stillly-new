"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
};

/** A button/link that leans toward the cursor. Monochrome. */
export default function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width / 2;
    const my = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${mx * 0.2}px, ${my * 0.3}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const base =
    "inline-flex items-center gap-2 rounded-full px-6 py-3 font-[family-name:var(--font-display)] font-medium text-[0.95rem] transition-[background,color,box-shadow] duration-300 will-change-transform";
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:bg-zinc-200"
      : "border border-[color:var(--color-line)] bg-[color:var(--color-surface)] text-white hover:bg-[color:var(--color-surface-2)]";
  const cls = `${base} ${styles} ${className}`;

  if (external) {
    return (
      <a
        ref={ref}
        href={href}
        onMouseMove={onMove}
        onMouseLeave={reset}
        data-magnetic
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      data-magnetic
      className={cls}
    >
      {children}
    </Link>
  );
}
