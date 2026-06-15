import Nav from "@/components/ui/Nav";
import SmoothScroll from "@/components/ui/SmoothScroll";
import EnterScreen from "@/components/splash/EnterScreen";
import AmbientPlayer from "@/components/audio/AmbientPlayer";
import HeroCanvas from "@/three/HeroCanvas";
import ScrollScene from "@/components/home/ScrollScene";
import BioCard from "@/components/bio/BioCard";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <EnterScreen />
      <SmoothScroll />
      <Nav />
      <AmbientPlayer />

      <main className="relative">
        {/* ---------- HERO ---------- */}
        <section className="relative flex h-[100svh] flex-col items-center justify-center overflow-hidden px-5 text-center">
          <div className="absolute inset-0 z-0">
            <HeroCanvas />
          </div>

          <div className="relative z-10 flex flex-col items-center [text-shadow:0_2px_30px_rgba(0,0,0,0.7)]">
            <p
              className="hero-rise mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-2 font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-dim)]"
              style={{ animationDelay: "0.1s" }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full bg-white"
                style={{ animation: "pulse-ring 2s infinite" }}
              />
              {site.tagline} · stillly.xyz
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-6xl font-bold leading-[0.92] tracking-tight sm:text-7xl md:text-[8.5rem]">
              <span className="hero-rise block" style={{ animationDelay: "0.22s" }}>
                {site.name}
              </span>
              <span className="hero-rise shimmer block" style={{ animationDelay: "0.34s" }}>
                builds for the web.
              </span>
            </h1>
            <p
              className="hero-rise mt-7 max-w-xl text-[color:var(--color-fg-dim)] sm:text-lg"
              style={{ animationDelay: "0.46s" }}
            >
              Interactive 3D, thoughtful interfaces, and tools that feel alive —
              rendered in black &amp; white.
            </p>
            <div
              className="hero-rise mt-9 flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: "0.58s" }}
            >
              <MagneticButton href="/portfolio">
                View my work
                <span aria-hidden>→</span>
              </MagneticButton>
              <MagneticButton href="/#bio" variant="ghost">
                About me
              </MagneticButton>
            </div>
          </div>

          <div
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 font-[family-name:var(--font-mono)] text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--color-fg-faint)]"
            style={{ animation: "floatY 2.4s ease-in-out infinite" }}
          >
            scroll ↓
          </div>
        </section>

        {/* ---------- SCROLL SCENES ---------- */}
        <ScrollScene side="left" shape="knot" eyebrow="01 — Craft" title="Details, obsessed over.">
          <p>
            Every easing curve, every byte on the wire, every focus ring. The
            good stuff hides in the details most people never notice — until
            it&apos;s missing. I sweat them so the work feels effortless.
          </p>
        </ScrollScene>

        <ScrollScene side="right" shape="ico" eyebrow="02 — Range" title="Pixels to performance.">
          <p>
            Prototyping interactions in the morning, shipping production systems
            by afternoon. Design and engineering aren&apos;t separate
            disciplines to me — they&apos;re the same loop.
          </p>
        </ScrollScene>

        {/* ---------- BIO ---------- */}
        <section
          id="bio"
          className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-5 py-28 sm:px-10 md:grid-cols-2"
        >
          <Reveal>
            <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--color-fg-faint)]">
              Bio
            </p>
            <h2 className="mb-5 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Hey, I&apos;m {site.name}.
            </h2>
            <div className="space-y-4 text-[color:var(--color-fg-dim)]">
              <p>
                I&apos;m a developer who loves building things that feel alive —
                from GPU shaders to clean little tools. This whole site is one of
                them: hand-built, no templates, monochrome on purpose.
              </p>
              <p>
                The card on the right is my live Discord presence. If I&apos;m
                online, you&apos;ll see it. If I&apos;m listening to something,
                you&apos;ll see that too.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <BioCard />
          </Reveal>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section id="contact" className="mx-auto max-w-3xl px-5 py-28 text-center sm:px-10">
          <Reveal>
            <p className="mb-3 font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--color-fg-faint)]">
              Contact
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
              Let&apos;s build something
              <br />
              <span className="shimmer">worth remembering.</span>
            </h2>
            <div className="mt-9 flex justify-center">
              <MagneticButton href="mailto:hello@stillly.xyz" external>
                hello@stillly.xyz <span aria-hidden>→</span>
              </MagneticButton>
            </div>
            <ul className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-2 font-[family-name:var(--font-mono)] text-sm text-[color:var(--color-fg-dim)]">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="transition-colors hover:text-white"
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        <footer className="border-t border-[color:var(--color-line)] px-5 py-8 text-center font-[family-name:var(--font-mono)] text-xs text-[color:var(--color-fg-faint)] sm:px-10">
          © {new Date().getFullYear()} {site.name} · handcrafted, no frameworks of the soul
        </footer>
      </main>
    </>
  );
}
