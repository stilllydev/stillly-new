// Central site configuration. Edit these to personalize.
export const site = {
  name: "stillly_dev",
  domain: "stillly.xyz",
  url: "https://stillly.xyz",
  tagline: "Creative developer",
  description:
    "stillly_dev — creative developer. Interactive 3D, live Discord presence, and a portfolio of things worth remembering.",
  // The owner's Discord user ID (numeric snowflake). Used for Lanyard live presence.
  // Falls back to a placeholder; set NEXT_PUBLIC_LANYARD_USER_ID in your env.
  discordUserId: process.env.NEXT_PUBLIC_LANYARD_USER_ID ?? "",
  socials: [
    { label: "GitHub", href: "https://github.com/stilllydev" },
    { label: "Discord", href: "#" },
    { label: "Twitter / X", href: "#" },
    { label: "Email", href: "mailto:hello@stillly.xyz" },
  ],
} as const;

export type Social = (typeof site.socials)[number];
