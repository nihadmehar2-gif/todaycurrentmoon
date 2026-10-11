import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Real canonical page URLs only (no hash fragments).
  const priorities: Record<string, number> = {
    "/": 1,
    "/moon-phases": 0.8,
    "/moon-calendar": 0.8,
    "/moon-calculator": 0.8,
    "/about": 0.5,
    "/contact": 0.5,
    "/privacy-policy": 0.3,
    "/terms": 0.3,
  };
  const frequencies: Record<string, "daily" | "weekly" | "monthly" | "yearly"> =
    {
      "/": "daily",
      "/moon-phases": "weekly",
      "/moon-calendar": "weekly",
      "/moon-calculator": "weekly",
      "/about": "monthly",
      "/contact": "monthly",
      "/privacy-policy": "yearly",
      "/terms": "yearly",
    };

  return ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path === "/" ? "" : r.path}`,
    lastModified: now,
    changeFrequency: frequencies[r.path],
    priority: priorities[r.path],
  }));
}
