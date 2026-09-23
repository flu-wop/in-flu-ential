import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@flu-wop/design-system"],
  turbopack: {},
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
