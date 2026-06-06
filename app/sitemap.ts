import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Public routes only — hidden tool pages are intentionally excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/portfolio`, changeFrequency: "weekly", priority: 0.8 },
  ];
}
