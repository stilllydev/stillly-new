# Revamp Prompt — stillly.xyz

> Paste everything below into a capable coding agent to rebuild this site from scratch.
> It is written as a "revamp an existing site" brief.

---

You are revamping my existing personal website, **stillly.xyz**, for a developer who goes by **stillly_dev**. The current site is a bare placeholder. Rebuild it from the ground up into a premium, memorable experience. The bar: **nothing basic — everything should feel amazing.** Reference vibe is **guns.lol** (animated, premium "bio-link" energy) but rendered in a **strict black-and-white monochrome** theme — no color at all; depth comes from contrast, blur, film grain, glow, and motion.

## Stack (use exactly this)
- **Next.js (App Router) + React + TypeScript**, **Tailwind CSS v4**.
- **react-three-fiber + @react-three/drei + @react-three/postprocessing** for 3D, **lenis** for smooth scroll.
- **Supabase** (Postgres + Storage + Discord OAuth) via **@supabase/ssr**.
- **Groq** SDK (server-side only) for the AI tools.
- **Lanyard** API for live Discord presence.
- Deploy target: **Vercel**, domain **stillly.xyz**. No page templates — hand-build everything.

## Global experience
- A **"click to enter" splash** screen (once per session) that fades into the site.
- A **custom monochrome cursor** (smoothed follow-ring + dot, `mix-blend-mode: difference`), disabled on touch + reduced-motion.
- A fixed **film-grain** overlay + **vignette**, glassmorphism cards, scroll-reveal, magnetic buttons.
- An **opt-in ambient audio** widget (off by default).
- Full **`prefers-reduced-motion`** support: swap WebGL for a static gradient, disable parallax/animation.
- Fonts: a geometric grotesk for display (e.g. Space Grotesk), Inter for body, JetBrains Mono for accents.

## Structure (hybrid)
Home + Bio are one scrolling experience; Portfolio is its own route; Admin is separate; three "hidden" tool pages are URL-only.

| Route | Visibility | Purpose |
|---|---|---|
| `/` | public | Splash → 3D hero → scroll-driven 3D scenes → live bio card → contact |
| `/portfolio` | public | Project grid; each card has a **"Learn more"** modal (long description + image gallery) |
| `/admin` | owner-only | Discord OAuth, CRUD projects, upload images |
| `/auth/callback` | system | Supabase OAuth code exchange |
| `/humanizer` | hidden | AI-text humanizer |
| `/source-checker` | hidden | Source reliability scorer |
| `/arcade` | hidden | Embedded open-source games, fullscreen |

## Home / 3D (the centerpiece)
- A **persistent, client-only `<Canvas>`** (mounts after hydration to avoid SSR mismatch).
- **Hero:** a UNIQUE, mouse-reactive **GPU point cloud** — points on a sphere shell displaced by **3D simplex noise** over time (an organic "breathing nebula") that bends toward the pointer, white **additive** points with **bloom**. It must NOT be based on any avatar, and must never look broken or weird.
- Below the hero, **1–2 secondary 3D scenes** (e.g. rotating wireframe forms) that **slide on/off screen as the user scrolls** (transform + opacity tied to scroll progress).
- Overlaid hero copy with a shimmering monochrome headline, status pill, and magnetic CTAs.

## Bio (live Discord presence — Lanyard)
- A glassmorphic profile card that shows **live Discord status** (online/idle/dnd/offline dot), current activity, and **Spotify "now playing"** (album art, song, artist, live progress bar) when listening.
- Real-time via the **Lanyard WebSocket** (`wss://api.lanyard.rest/socket`: op1 hello → heartbeat op3 → subscribe op2 → op0 `INIT_STATE`/`PRESENCE_UPDATE`) with a **REST polling fallback** (`https://api.lanyard.rest/v1/users/:id`). Owner must be in the Lanyard Discord server.

## Portfolio
- Server-fetch **published** projects (RLS anon read). Cards with cover, title, short description, tags, and a **"Learn more"** button opening an accessible **modal** (focus-trap, Esc/click-out) with the long description + image gallery. Ship sensible **sample data** so it's never empty pre-database.

## Admin (`/admin`) — owner-only
- **Sign in with Discord** (Supabase OAuth). Restrict to a **single owner** with defense-in-depth: (1) middleware/proxy redirect, (2) server-side guard on every admin action checking `user.id === ADMIN_USER_ID`, (3) **Postgres RLS** + storage policies allowing writes only for that UUID.
- CRUD projects: title, slug (auto from title), short + long description, tags, cover image URL, **multiple gallery images uploaded to Supabase Storage**, ordering, published toggle. Use Server Actions.

## Data model (Supabase)
- `projects(id uuid pk, slug unique, title, description, long_description, tags text[], cover_image_url, ordering int, published bool, created_at, updated_at)`.
- `project_images(id uuid pk, project_id fk on delete cascade, storage_path, public_url, alt_text, ordering)`.
- RLS: anon/public may SELECT only `published = true`; all writes require `(select auth.uid()) = <owner uuid>` (use an `is_admin()` SECURITY DEFINER helper). Private `portfolio-images` bucket: owner writes, public reads. Provide SQL migrations.

## Hidden tools (URL-only: no nav links, `noindex`, excluded from sitemap, `X-Robots-Tag`; optional shared-passphrase cookie gate)
- **Humanizer** (`/humanizer` + `/api/humanize`): textarea → Groq rewrites text to read human. Encode the **blader/humanizer** ruleset (MIT; ~30 patterns across content/language/style/communication/hedging — burstiness, perplexity, kill AI clichés like "delve"/"tapestry", reduce em-dashes & rule-of-three, contractions, no chatbot artifacts). Optional "match my voice" sample. Copy button.
- **Source checker** (`/source-checker` + `/api/check-source`): input is a **URL** OR a **pasted/dropped image**. URL → fetch with a browser UA + extract readable text via `@mozilla/readability` + `jsdom`; image → send base64 to a **Groq vision model**. Return **structured JSON**: reliability_score 0–100, source_type primary/secondary/tertiary, author/byline, citation strength, recency, domain reputation, bias, fact-vs-opinion, flags[], rationale, recommendations. Render a monochrome score gauge + scorecard + flags. Make the model IDs overridable via env.
- **Arcade** (`/arcade`): a registry-driven grid of **genuinely open-source** browser games vendored into `public/games/<slug>/`, each played in a **sandboxed iframe** with a **Fullscreen** button (`requestFullscreen`, `allow="fullscreen"`, user gesture). Include e.g. 2048 (MIT), Hextris (GPL-3.0), HexGL (MIT), Astray (MIT), plus an original block-puzzle and a Matter.js physics sandbox. **Exclude proprietary titles** (Block Blast, People Playground) — they can't be legally embedded.

## Env vars
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_ADMIN_USER_ID`, `NEXT_PUBLIC_LANYARD_USER_ID`, `GROQ_API_KEY`, optional `GROQ_TEXT_MODEL` / `GROQ_VISION_MODEL` / `TOOLS_PASSPHRASE`. Everything must **degrade gracefully** when a service isn't configured (sample data, friendly "not configured" states) so the site always builds and runs.

## Quality bar / acceptance
- `tsc` clean, `next build` clean, no hydration errors.
- 60fps hero on a typical laptop; lazy-load 3D; clamp DPR `[1,2]`; bloom only on emissive whites.
- Accessible modals/menus, alt text, keyboard nav, reduced-motion paths.
- Hidden pages truly unlinked + `noindex`; admin truly owner-only at every layer.
- Configure `next/image` remote hosts (Discord CDN, Spotify, Supabase). Provide a README with setup + the SQL.
