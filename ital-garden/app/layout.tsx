import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CONTACT, HOURS_SCHEMA, SITE } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${SITE.domain}`),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  openGraph: {
    siteName: SITE.name,
    type: "website",
    locale: "en_US",
    url: `https://${SITE.domain}`,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: SITE.name,
  servesCuisine: ["Vegan", "Soul Food", "Creole"],
  priceRange: "$$",
  image: `https://${SITE.domain}/opengraph-image`,
  url: `https://${SITE.domain}`,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.addressLine1,
    addressLocality: CONTACT.city,
    addressRegion: CONTACT.state,
    postalCode: CONTACT.zip,
    addressCountry: "US",
  },
  openingHoursSpecification: HOURS_SCHEMA.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.day,
    opens: h.opens,
    closes: h.closes,
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="grain bg-studio-black text-cream antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
