import type { Metadata } from "next";
import "@flu-wop/design-system/core.css";
import "@flu-wop/design-system/compat.css";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";
import SessionProvider from "@/components/console/SessionProvider";
import { Caveat } from "next/font/google";

// Handwriting for the Polaroid captions on Music.
const caveat = Caveat({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-hand", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "IN-FLU-ENTIAL LLC | Producer, engineer, builder",
  description:
    "Websites, social media marketing and AI tools from a producer and engineer. Mix the session on the console.",
  openGraph: {
    title: "IN-FLU-ENTIAL LLC",
    description: "Websites, social media marketing and AI tools from a producer and engineer.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IN-FLU-ENTIAL LLC console" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IN-FLU-ENTIAL LLC",
    description: "Websites, social media marketing and AI tools from a producer and engineer.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="studio" lang="en" className={`scroll-smooth ${caveat.variable}`}>
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
