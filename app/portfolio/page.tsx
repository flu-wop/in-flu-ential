import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
const DragPortfolio = dynamic(() => import("@/components/DragPortfolio"), { ssr: false });
const TextReveal    = dynamic(() => import("@/components/TextReveal"),    { ssr: false });
const FadeUp        = dynamic(() => import("@/components/FadeUp"),        { ssr: false });

export const metadata: Metadata = {
  title: "Portfolio | IN-FLU-ENTIAL LLC",
  description: "Selected work spanning websites, brand campaigns, pitch decks, and digital ecosystems.",
};

// ─────────────────────────────────────────────
// PORTFOLIO ITEMS
// ─────────────────────────────────────────────
const PORTFOLIO_ITEMS = [
  {
    id: "mid-city-sound",
    category: "Website",
    title: "Mid City Sound Studios",
    desc: "Premium recording studio with full booking system — online scheduling, Stripe deposits, engineer pages, and merch store.",
    tags: ["Next.js", "Booking System", "Brand Identity"],
    url: "https://midcitysound.com",
    previewUrl: "https://midcitysound.com",
    live: true,
  },
  {
    id: "epoch-skin",
    category: "Website",
    title: "Epoch Skin",
    desc: "Luxury waxing studio and organic skincare brand. Full e-commerce build with booking, Stripe, and a three-part logo system.",
    tags: ["Next.js", "E-Commerce", "Brand Identity"],
    url: "https://epoch-skin.com",
    previewUrl: "https://epoch-skin.com",
    live: true,
  },
  {
    id: "donald-markowitz",
    category: "Website",
    title: "Donald Markowitz",
    desc: "Press and legacy site for an Academy Award-winning songwriter — timeline, film & TV credits, discography, and stats.",
    tags: ["Next.js", "Editorial Design", "Portfolio"],
    url: "https://donaldmarkowitz.com",
    previewUrl: "https://donaldmarkowitz.com",
    live: true,
  },
  {
    id: "jade-the-gem",
    category: "Website",
    title: "Jade the Gem — DJ Site",
    desc: "Booking and merch platform for a working DJ — R3F 3D gem hero, Stripe checkout, Printful integration, and full mobile experience.",
    tags: ["Next.js", "Three.js", "Merch + Booking"],
    url: "https://jade-the-gem-dj.vercel.app",
    previewUrl: "https://jade-the-gem-dj.vercel.app",
    live: true,
  },
  {
    id: "fluhaul",
    category: "Website",
    title: "Flu-Haul",
    desc: "Cinematic junk removal business site with Lenis smooth scroll, GSAP parallax, and a full service + booking flow.",
    tags: ["Next.js", "GSAP", "Lenis"],
    url: "https://fluhaul.com",
    previewUrl: "https://fluhaul.com",
    live: true,
  },
  {
    id: "streetbeat",
    category: "Documentary",
    title: "Streetbeat Documentary",
    desc: "Full digital ecosystem for an independent film — marketing site, streaming paywall, and campaign across platforms.",
    tags: ["Next.js", "Streaming", "Campaign"],
    url: "https://streetbeat.video",
    previewUrl: "https://streetbeat.video",
    live: true,
  },
  {
    id: "lil-squiggle",
    category: "Campaign",
    title: "Lil Squiggle — #DontDrinkAndDial",
    desc: "Reggae-dub chibi character brand with merch store, landing page, and multi-platform social strategy across TikTok, IG, and X.",
    tags: ["Brand Campaign", "Merch", "Social Strategy"],
    url: "https://lilsquiggle.vercel.app",
    previewUrl: "https://lilsquiggle.vercel.app",
    live: true,
  },
  {
    id: "prof-longhair",
    category: "Pitch Deck",
    title: "Professor Longhair Documentary Pitch",
    desc: "Investor pitch deck for Fish Pot Studios — narrative arc, market positioning, and funding strategy for a New Orleans music documentary.",
    tags: ["Pitch Deck", "Brand Narrative", "Film"],
    live: false,
  },
  {
    id: "graham-hill",
    category: "Website",
    title: "Graham Hill — Solo Album Campaign",
    desc: "Debut LP launch site and campaign for the Beach House drummer — press, streaming, and artist identity from scratch.",
    tags: ["Next.js", "Music Campaign", "Artist Brand"],
    live: false,
    nda: false,
    pending: true,
  },
  {
    id: "egoff",
    category: "Website",
    title: "EGOFF Essentials",
    desc: "Luxury natural soap brand — single-page editorial site built with flat HTML and Tailwind CDN.",
    tags: ["HTML", "Tailwind", "Brand"],
    url: "https://egoff.vercel.app",
    previewUrl: "https://egoff.vercel.app",
    live: true,
  },
  {
    id: "streetbeats",
    category: "Platform",
    title: "Streetbeats Platform",
    desc: "Beat marketplace — interactive cards, waveform viz, NOLA green accent, and email capture.",
    tags: ["Next.js", "Marketplace", "Music"],
    url: "https://streetbeats.video",
    previewUrl: "https://streetbeats.video",
    live: true,
  },
  {
    id: "athlete-brand",
    category: "Branding",
    title: "Former Saints Player — Personal Brand",
    desc: "Identity system and digital presence for an NFL athlete transitioning into entrepreneurship and media. High-stakes personal branding.",
    tags: ["Personal Brand", "Pitch Deck", "Website"],
    live: false,
  },
  {
    id: "resume-system",
    category: "Visual System",
    title: "Executive Resume Suite",
    desc: "Premium resume, cover letter, and LinkedIn optimization system for a C-suite transition client.",
    tags: ["Resume Design", "Personal Brand", "Typography"],
    live: false,
  },
];

const CATEGORIES = ["All", "Website", "Campaign", "Documentary", "Pitch Deck", "Branding", "Visual System"];

// ─────────────────────────────────────────────
// PLACEHOLDER CONFIGS — swap src for real image when ready
// ─────────────────────────────────────────────
const PLACEHOLDERS: Record<string, { label: string; accent: string; pattern: string }> = {
  "mid-city-sound":   { label: "Studio · Booking · Brand",      accent: "#C9A84C", pattern: "repeating-linear-gradient(45deg, #C9A84C11 0px, #C9A84C11 1px, transparent 1px, transparent 12px)" },
  "epoch-skin":       { label: "Waxing · Skincare · E-Commerce", accent: "#8B9E7A", pattern: "repeating-linear-gradient(135deg, #8B9E7A11 0px, #8B9E7A11 1px, transparent 1px, transparent 14px)" },
  "donald-markowitz": { label: "Artist · Legacy · Credits",      accent: "#A89880", pattern: "repeating-linear-gradient(0deg, #A8988011 0px, #A8988011 1px, transparent 1px, transparent 16px)" },
  "jade-the-gem":     { label: "DJ · Booking · Merch",           accent: "#7BA3C4", pattern: "repeating-linear-gradient(60deg, #7BA3C411 0px, #7BA3C411 1px, transparent 1px, transparent 10px)" },
  "fluhaul":          { label: "Junk Removal · Cinematic",       accent: "#C4874A", pattern: "repeating-linear-gradient(90deg, #C4874A11 0px, #C4874A11 1px, transparent 1px, transparent 18px)" },
  "streetbeat":       { label: "Documentary · Streaming",        accent: "#4AC4A8", pattern: "repeating-linear-gradient(45deg, #4AC4A811 0px, #4AC4A811 1px, transparent 1px, transparent 12px)" },
  "lil-squiggle":     { label: "Campaign · Merch · Social",      accent: "#C4C44A", pattern: "repeating-linear-gradient(135deg, #C4C44A11 0px, #C4C44A11 1px, transparent 1px, transparent 10px)" },
  "prof-longhair":    { label: "Pitch Deck · Film · Investor",   accent: "#9A7AC4", pattern: "repeating-linear-gradient(0deg, #9A7AC411 0px, #9A7AC411 1px, transparent 1px, transparent 14px)" },
  "graham-hill":      { label: "Album Campaign · Artist Brand",  accent: "#C4A47A", pattern: "repeating-linear-gradient(60deg, #C4A47A11 0px, #C4A47A11 1px, transparent 1px, transparent 12px)" },
  "egoff":            { label: "Soap · Luxury · Editorial",         accent: "#C4A47A", pattern: "repeating-linear-gradient(60deg, #C4A47A11 0px, #C4A47A11 1px, transparent 1px, transparent 14px)" },
  "streetbeats":      { label: "Beats · Platform · Marketplace",    accent: "#4AAA6A", pattern: "repeating-linear-gradient(90deg, #4AAA6A11 0px, #4AAA6A11 1px, transparent 1px, transparent 16px)" },
  "athlete-brand":    { label: "Personal Brand · NDA",           accent: "#7AC4A8", pattern: "repeating-linear-gradient(45deg, #7AC4A811 0px, #7AC4A811 1px, transparent 1px, transparent 14px)" },
  "resume-system":    { label: "Visual System · NDA",            accent: "#A8A87A", pattern: "repeating-linear-gradient(135deg, #A8A87A11 0px, #A8A87A11 1px, transparent 1px, transparent 12px)" },
};

// ─────────────────────────────────────────────
// PREVIEW COMPONENT
// Styled placeholder — swap bg for <Image> when real photo is ready
// ─────────────────────────────────────────────
function ProjectPreview({ item }: { item: typeof PORTFOLIO_ITEMS[0] }) {
  const ph = PLACEHOLDERS[item.id] || { label: item.category, accent: "#C9A84C", pattern: "" };

  return (
    <div
      className="h-52 relative overflow-hidden border-b border-white/5 flex items-end"
      style={{ background: `#111`, backgroundImage: ph.pattern }}
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: ph.accent }}
      />
      {/* Bottom label bar */}
      <div className="relative w-full px-5 py-4 bg-gradient-to-t from-ink via-ink/80 to-transparent">
        <p className="font-sans text-[9px] tracking-widest uppercase" style={{ color: ph.accent }}>
          {ph.label}
        </p>
      </div>
      {/* Live dot top-right */}
      {item.live && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="font-sans text-[9px] text-mist/60 tracking-widest uppercase">Live</span>
        </div>
      )}
      {item.pending && (
        <div className="absolute top-4 right-4">
          <span className="font-sans text-[9px] tracking-widest uppercase text-gold/50">In Progress</span>
        </div>
      )}
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(45deg, #C9A84C 25%, transparent 25%), linear-gradient(-45deg, #C9A84C 25%, transparent 25%)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6 fade-up">Selected Work</p>
          <TextReveal as="h1" className="font-display font-light text-5xl sm:text-6xl md:text-7xl text-cream leading-tight max-w-3xl" split="words" delay={0.1}>
            Work that speaks first.
          </TextReveal>
          <p className="font-sans text-base text-mist max-w-xl leading-relaxed mt-6 fade-up-delay-2">
            Websites, campaigns, identities, and decks — production-grade output across music, business, and culture.
          </p>
        </div>
      </section>

      {/* ── DRAG PORTFOLIO ──────────────────────── */}
      <section className="py-4 pb-16">
        <DragPortfolio />
      </section>

            {/* ── CTA ──────────────────────────────────── */}
      <section className="py-20 bg-ink-2 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Want to be next?</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-8">
            Let&apos;s build something<br /><span className="italic">worth showing.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking?type=free"
              className="inline-block bg-gold text-ink px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300"
            >
              Free Discovery Call
            </Link>
            <Link
              href="/business"
              className="inline-block border border-gold/50 text-gold px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-ink transition-all duration-300"
            >
              View Packages
            </Link>
          </div>
          <p className="font-sans text-xs text-mist/40 mt-5">Reply within one business day. Always a human.</p>
        </div>
      </section>
    </>
  );
}
