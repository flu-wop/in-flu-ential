import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IN-FLU-ENTIAL LLC | A Building of Influence",
  description:
    "Creative direction, brand development, and music marketing rooted in New Orleans. Global Roots. Executive Vision. Creative Execution.",
  openGraph: {
    title: "IN-FLU-ENTIAL LLC",
    description: "A Building of Influence — New Orleans Creative Direction & Strategy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  );
}
