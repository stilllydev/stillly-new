"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Reveal from "@/components/ui/Reveal";
import type { Project } from "@/lib/projects";

function Cover({ project, className = "" }: { project: Project; className?: string }) {
  if (project.cover_image_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={project.cover_image_url}
        alt=""
        className={`object-cover grayscale transition-transform duration-700 group-hover:scale-105 ${className}`}
      />
    );
  }
  // Generated monochrome placeholder
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center ${className}`}
      style={{
        background:
          "radial-gradient(80% 80% at 30% 20%, rgba(255,255,255,0.16), transparent 60%), #0c0c10",
      }}
    >
      <span className="font-[family-name:var(--font-display)] text-5xl font-bold text-white/15">
        {project.title.slice(0, 2)}
      </span>
    </div>
  );
}

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.id} delay={(i % 2) * 90}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)]">
              <div className="relative h-52 w-full overflow-hidden">
                <Cover project={p} className="absolute inset-0 h-full w-full" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-[color:var(--color-fg-dim)]">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-[color:var(--color-surface-2)] px-3 py-1 font-[family-name:var(--font-mono)] text-[0.7rem] text-[color:var(--color-fg-dim)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setActive(p)}
                  className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-[color:var(--color-line)] px-4 py-2 text-sm transition-colors hover:bg-white hover:text-black"
                >
                  Learn more <span aria-hidden>→</span>
                </button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} label={active?.title}>
        {active && (
          <div>
            <div className="mb-5 h-56 w-full overflow-hidden rounded-2xl">
              <Cover project={active} className="h-full w-full" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
              {active.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {active.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[color:var(--color-surface-2)] px-3 py-1 font-[family-name:var(--font-mono)] text-[0.7rem] text-[color:var(--color-fg-dim)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-[color:var(--color-fg-dim)]">
              {active.long_description || active.description}
            </p>

            {active.images && active.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-3">
                {active.images
                  .slice()
                  .sort((a, b) => a.ordering - b.ordering)
                  .map((img) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={img.id}
                      src={img.public_url}
                      alt={img.alt_text ?? ""}
                      className="w-full rounded-xl object-cover grayscale transition-all hover:grayscale-0"
                    />
                  ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
