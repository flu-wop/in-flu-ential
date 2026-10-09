import type { Metadata } from "next";
import "@flu-wop/design-system/core.css";
import "@flu-wop/design-system/compat.css";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "IN-FLU-ENTIAL LLC | Producer, engineer, builder",
  description:
    "Websites, campaigns and AI tools from a New Orleans producer and engineer. Mix the session on the console.",
  openGraph: {
    title: "IN-FLU-ENTIAL LLC",
    description: "Websites, campaigns and AI tools from a New Orleans producer and engineer.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IN-FLU-ENTIAL LLC console" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IN-FLU-ENTIAL LLC",
    description: "Websites, campaigns and AI tools from a New Orleans producer and engineer.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="studio" lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
