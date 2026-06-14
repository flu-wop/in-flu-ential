import type { Metadata } from "next";
import { cormorant, dmSans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "IN-FLU-ENTIAL LLC | A Building of Influence",
    template: "%s | IN-FLU-ENTIAL LLC",
  },
  description:
    "Creative direction, brand development, and music marketing rooted in New Orleans. Global Roots. Executive Vision. Creative Execution.",
  keywords: [
    "creative direction", "branding studio", "music industry", "brand strategy",
    "New Orleans", "executive consulting", "artist development", "marketing agency",
  ],
  openGraph: {
    title: "IN-FLU-ENTIAL LLC",
    description: "Global Roots. Executive Vision. Creative Execution.",
    url: "https://in-flu-ential.vercel.app",
    siteName: "IN-FLU-ENTIAL LLC",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IN-FLU-ENTIAL LLC",
    description: "Global Roots. Executive Vision. Creative Execution.",
    images: ["/og-image.jpg"],
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-[#080808] text-[#F5EDD8] antialiased">
        {children}
      </body>
    </html>
  );
}
