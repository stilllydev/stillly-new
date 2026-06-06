import type { Metadata } from "next";
import Link from "next/link";
import LoginButton from "./LoginButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-5 text-center">
      <div className="w-full max-w-sm rounded-3xl glass p-8">
        <div className="mb-4 text-2xl">✦</div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Admin access
        </h1>
        <p className="mb-7 mt-2 text-sm text-[color:var(--color-fg-dim)]">
          Owner only. Sign in with Discord to manage the portfolio.
        </p>
        <LoginButton />
        {error === "unauthorized" && (
          <p className="mt-5 font-[family-name:var(--font-mono)] text-xs text-red-400">
            That account isn&apos;t allowed in here.
          </p>
        )}
        {error === "auth" && (
          <p className="mt-5 font-[family-name:var(--font-mono)] text-xs text-red-400">
            Sign-in failed. Try again.
          </p>
        )}
        <Link
          href="/"
          className="mt-6 inline-block font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-faint)] hover:text-white"
        >
          ← back to site
        </Link>
      </div>
    </main>
  );
}
