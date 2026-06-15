// Central site configuration. Edit these to personalize.

// --- Bake-in values (none of these are secret) ---
// Your numeric Discord user ID enables the live bio with no env var needed.
// (You must also be in the Lanyard Discord server: discord.gg/lanyard)
const DISCORD_USER_ID = "";
// Optional: hard-wire Supabase (the URL + anon key are public by design and
// protected by row-level security) so the admin/portfolio works without env vars.
const SUPABASE_URL = "";
const SUPABASE_ANON_KEY = "";
// Your Supabase auth UUID — the only account allowed into /admin.
const ADMIN_USER_ID = "";

export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY,
  adminUserId: process.env.NEXT_PUBLIC_ADMIN_USER_ID || ADMIN_USER_ID,
};

export const site = {
  name: "stillly_dev",
  domain: "stillly.xyz",
  url: "https://stillly.xyz",
  tagline: "Creative developer",
  description:
    "stillly_dev — creative developer. Interactive 3D, live Discord presence, and a portfolio of things worth remembering.",
  // The owner's Discord user ID (numeric snowflake). Used for Lanyard live presence.
  discordUserId: process.env.NEXT_PUBLIC_LANYARD_USER_ID || DISCORD_USER_ID,
  socials: [
    { label: "GitHub", href: "https://github.com/stilllydev" },
    { label: "Discord", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "Email", href: "mailto:hello@stillly.xyz" },
  ],
} as const;

export type Social = (typeof site.socials)[number];
