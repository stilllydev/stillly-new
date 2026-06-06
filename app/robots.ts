import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/portfolio"],
      disallow: ["/admin", "/humanizer", "/source-checker", "/arcade", "/api"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
