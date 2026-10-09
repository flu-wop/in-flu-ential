import type { MetadataRoute } from "next";

import { SITE_URL as BASE_URL } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/booking",
    "/business",
    "/music",
    "/portfolio",
    "/privacy",
    "/products",
    "/terms",
    "/vault",
  ];

  return staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
