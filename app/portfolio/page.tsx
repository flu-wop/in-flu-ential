import type { Metadata } from "next";
import Link from "next/link";

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
    id: "mvc-creations",
    category: "Website",
    title: "MVC Creations",
    desc: "Luxury press-on nail brand site — Next.js 15, Shopify integration pending, and a high-fashion editorial aesthetic.",
    tags: ["Next.js", "E-Commerce", "Beauty"],
    url: "https://mvc-creations.vercel.app",
    previewUrl: "https://mvc-creations.vercel.app",
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
// PREVIEW COMPONENT
// Uses iframe for live sites, styled placeholder for NDA/pending
// ─────────────────────────────────────────────
function ProjectPreview({ item }: { item: typeof PORTFOLIO_ITEMS[0] }) {
  if (item.previewUrl) {
    return (
      <div className="h-48 relative overflow-hidden border-b border-white/5 bg-ink-3">
        <iframe
          src={item.previewUrl}
          title={`${item.title} preview`}
          className="absolute inset-0 w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
        />
        {/* Overlay so hover doesn't interact with iframe */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-3/60" />
      </div>
    );
  }

  // NDA / pending — styled placeholder
  const label = item.pending ? "In Progress" : "NDA / Private";
  const color = item.pending ? "text-gold/50" : "text-mist/30";
  return (
    <div className="h-48 bg-ink-3 border-b border-white/5 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/3 to-transparent" />
      <div className="text-center">
        <div className="w-8 h-px bg-gold/20 mx-auto mb-3" />
        <span className={`font-sans text-[10px] tracking-widest uppercase ${color}`}>{label}</span>
        <div className="w-8 h-px bg-gold/20 mx-auto mt-3" />
      </div>
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
          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl text-cream leading-tight max-w-3xl fade-up-delay-1">
            Work that<br /><span className="italic text-gold">speaks first.</span>
          </h1>
          <p className="font-sans text-base text-mist max-w-xl leading-relaxed mt-6 fade-up-delay-2">
            Websites, campaigns, identities, and decks — production-grade output across music, business, and culture.
          </p>
        </div>
      </section>

      {/* ── FILTER TABS ──────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pb-10">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <span
              key={cat}
              className={`font-sans text-xs tracking-widest uppercase px-4 py-2 border cursor-pointer transition-colors duration-200 ${
                cat === "All"
                  ? "border-gold text-gold"
                  : "border-white/10 text-mist hover:border-gold/40 hover:text-cream"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* ── GRID ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PORTFOLIO_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group border border-white/8 bg-ink-2 hover:border-gold/30 transition-all duration-400 hover:-translate-y-1 flex flex-col"
            >
              <ProjectPreview item={item} />

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-[10px] text-gold tracking-widest uppercase">{item.category}</span>
                  {item.live && (
                    <span className="flex items-center gap-1.5 font-sans text-[10px] text-mist">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
                    </span>
                  )}
                  {item.pending && (
                    <span className="flex items-center gap-1.5 font-sans text-[10px] text-gold/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                      In Progress
                    </span>
                  )}
                </div>
                <h3 className="font-display text-xl text-cream font-light mb-2 group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-mist leading-relaxed mb-5 flex-1">{item.desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {item.tags.map((t) => (
                    <span key={t} className="font-sans text-[10px] text-mist/60 border border-white/8 px-2.5 py-1">
                      {t}
                    </span>
                  ))}
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-xs text-gold tracking-widest uppercase hover:text-gold-light transition-colors duration-200"
                  >
                    View Live →
                  </a>
                ) : (
                  <span className="font-sans text-xs text-mist/40 tracking-widest uppercase">
                    {item.pending ? "Launching Soon" : "NDA / Private"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
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
