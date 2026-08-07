import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site-config";

const routes = ["", "/menu", "/events", "/catering", "/meal-prep", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${SITE.domain}`;
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/menu" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
