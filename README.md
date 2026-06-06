# stillly.xyz

A premium, black-and-white personal site for **stillly_dev** — interactive 3D, live Discord presence, an admin-driven portfolio, and a set of hidden personal tools.

Built with **Next.js 16 (App Router) · React 19 · Tailwind v4 · react-three-fiber · Supabase · Groq · Lanyard**. No page templates — everything is hand-built.

## What's inside

| Surface | Route | Notes |
|---|---|---|
| Home + Bio | `/` | Splash screen, mouse-reactive WebGL hero (simplex-noise point cloud + bloom), scroll-driven 3D scenes, and a **live Discord presence** card (Lanyard, with Spotify now-playing). |
| Portfolio | `/portfolio` | Project grid with accessible **"Learn more"** modals + image galleries. |
| Admin | `/admin` | **Discord OAuth, owner-only.** CRUD projects, upload images. |
| Humanizer | `/humanizer` | Hidden tool. Strips AI tells from text via Groq + the [blader/humanizer](https://github.com/blader/humanizer) ruleset. |
| Source Checker | `/source-checker` | Hidden tool. Scores an article URL or a pasted screenshot for reliability (Groq, vision-capable). |
| Arcade | `/arcade` | Hidden. Open-source browser games, fullscreen-capable. |

The three tool pages are **unlinked, `noindex`, and excluded from the sitemap**. Set `TOOLS_PASSPHRASE` for an optional soft gate (`/humanizer?key=...`).

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in the values (see below)
npm run dev                  # http://localhost:3000
```

The site runs immediately with **sample data** — Supabase, Groq and Lanyard each degrade gracefully until configured.

## Configuration

### 1. Discord presence (Lanyard)
- Set `NEXT_PUBLIC_LANYARD_USER_ID` to your numeric Discord user ID.
- Join the **Lanyard Discord server** (`discord.gg/lanyard`) so the public API can see your presence.

### 2. Supabase (portfolio + admin + image storage)
1. Create a Supabase project; copy the URL + anon key + service-role key into `.env.local`.
2. **Auth → Providers → Discord:** enable it, paste your Discord app's client ID/secret. Add redirect `https://<project-ref>.supabase.co/auth/v1/callback` to the Discord app (and your site's `/auth/callback`).
3. Run the SQL in `/sql` **in order** (`001_schema.sql`, `002_rls.sql`, `003_storage.sql`). Replace `<ADMIN_UUID>` in 002/003 with your Supabase auth UUID (visible under **Authentication → Users** after you sign in once).
4. Put that same UUID in `NEXT_PUBLIC_ADMIN_USER_ID` — it's the **only** account allowed into `/admin`.

Access is enforced three ways: proxy/middleware redirect, a server-side guard on every admin action, and Postgres RLS.

### 3. Groq (tools)
- Set `GROQ_API_KEY`. Models are configurable via `GROQ_TEXT_MODEL` / `GROQ_VISION_MODEL`.

### 4. Arcade games
Each game in `lib/games.ts` is `available: false` until you drop its static build into `public/games/<slug>/index.html`, then flip the flag. Only the listed open-source titles are included — proprietary games (Block Blast, People Playground) are intentionally excluded.

### Optional assets
- Replace `app/favicon.ico` with your avatar.
- Drop `public/audio/ambient.mp3` to enable the opt-in background-music widget.

## Deploy (Vercel)

Push to GitHub → import in Vercel → add all env vars → set the domain to `stillly.xyz`. Add your production `…/auth/callback` URL to both Supabase and the Discord app.

## Project layout

```
app/          routes (home, portfolio, admin, auth, api, hidden tools)
components/   ui, home, bio, portfolio, admin, tools, arcade, splash, audio
three/        WebGL scenes (HeroParticles + shaders, ObjectScene, Effects)
lib/          supabase clients, lanyard hook, groq, prompts, data access
sql/          Supabase schema + RLS + storage migrations
```
