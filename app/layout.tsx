import type { Metadata } from "next";
import { cormorant, dmSans } from "@/lib/fonts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IN-FLU-ENTIAL LLC | Creative Direction, Branding & Strategy",
    template: "%s | IN-FLU-ENTIAL LLC",
  },
  description:
    "Global Roots. Executive Vision. Creative Execution. Creative direction, branding, and marketing strategy for artists, founders, and premium brands.",
  keywords: [
    "creative direction", "branding studio", "music industry", "brand strategy",
    "New Orleans", "executive consulting", "artist development", "marketing agency",
  ],
  openGraph: {
    title: "IN-FLU-ENTIAL LLC",
    description: "Global Roots. Executive Vision. Creative Execution.",
    url: "https://influential.llc",
    siteName: "IN-FLU-ENTIAL LLC",
    // Replace /public/og-image.jpg with a real OG image (1200x630)
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IN-FLU-ENTIAL LLC",
    description: "Global Roots. Executive Vision. Creative Execution.",
    images: ["/og-image.jpg"],
  },
  icons: {
    // Replace /public/favicon.ico with your actual favicon
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-ink text-cream antialiased">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
