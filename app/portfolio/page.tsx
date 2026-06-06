import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/ui/Nav";
import SmoothScroll from "@/components/ui/SmoothScroll";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import Reveal from "@/components/ui/Reveal";
import { getPublishedProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects by stillly_dev.",
};

export default async function PortfolioPage() {
  const projects = await getPublishedProjects();

  return (
    <>
      <SmoothScroll />
      <Nav />
      <main className="mx-auto max-w-6xl px-5 pb-28 pt-32 sm:px-10">
        <Reveal>
          <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--color-fg-faint)]">
            Portfolio
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight sm:text-6xl">
            Selected work
          </h1>
          <p className="mt-4 max-w-xl text-[color:var(--color-fg-dim)]">
            A handful of things I&apos;ve designed and built. Hit{" "}
            <span className="text-white">Learn more</span> on any of them for the full story.
          </p>
        </Reveal>

        <div className="mt-12">
          <PortfolioGrid projects={projects} />
        </div>

        <div className="mt-16">
          <Link
            href="/"
            className="font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-fg-dim)] transition-colors hover:text-white"
          >
            ← back home
          </Link>
        </div>
      </main>
    </>
  );
}
