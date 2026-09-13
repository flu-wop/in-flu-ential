import type { MetadataRoute } from "next";

const BASE_URL = "https://in-flu-ential.vercel.app";

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
