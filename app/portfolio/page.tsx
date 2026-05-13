import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work spanning websites, animations, brand identities, pitch decks, and visual systems.",
};

// ─────────────────────────────────────────────
// PORTFOLIO ITEMS — edit this array to add/remove work
// ─────────────────────────────────────────────
const PORTFOLIO_ITEMS = [
  {
    id: "mid-city-sound",
    category: "Website",
    title: "Mid City Sound Studios",
    desc: "Premium recording studio website with online booking, session packages, and full brand identity.",
    tags: ["Next.js", "Brand Identity", "Booking System"],
    url: "https://midcitysound.com",
    live: true,
  },
  {
    id: "donald-markowitz",
    category: "Website",
    title: "Donald Markowitz — Artist Site",
    desc: "Artist portfolio and press site for photographer and visual storyteller Donny Markowitz.",
    tags: ["Next.js", "Editorial Design", "Portfolio"],
    url: "https://donaldmarkowitz.com",
    live: true,
  },
  {
    id: "streetbeat",
    category: "Documentary",
    title: "Streetbeat Documentary",
    desc: "Full marketing ecosystem for an independent documentary — site, streaming platform, and press materials.",
    tags: ["Next.js", "Streaming", "Campaign"],
    url: "https://streetbeat.video",
    live: true,
  },
  {
    id: "lil-squiggle",
    category: "Campaign",
    title: "Lil Squiggle — #DontDrinkAndDial",
    desc: "Viral reggae-dub chibi character campaign with merch store, landing page, and multi-platform social strategy.",
    tags: ["Brand Campaign", "Merch", "Social Strategy"],
    url: "https://lilsquiggle.com",
    live: true,
  },
  {
    id: "athlete-brand",
    category: "Branding",
    title: "Former Saints Player — Personal Brand",
    desc: "Identity system and digital presence for an NFL athlete transitioning into entrepreneurship and media.",
    tags: ["Personal Brand", "Pitch Deck", "Website"],
    live: false,
  },
  {
    id: "pitch-deck",
    category: "Pitch Deck",
    title: "Investor Pitch Deck — Consumer Brand",
    desc: "12-slide narrative pitch deck that secured a first-round investor meeting within 3 weeks of delivery.",
    tags: ["Pitch Deck", "Brand Narrative", "Design"],
    live: false,
  },
  {
    id: "mvc-creations",
    category: "Website",
    title: "MVC Creations",
    desc: "Creative studio site showcasing motion, visual, and content production services.",
    tags: ["Next.js", "Motion", "Creative Studio"],
    url: "https://mvc-creations.vercel.app",
    live: true,
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

const CATEGORIES = ["All", "Website", "Branding", "Campaign", "Pitch Deck", "Documentary", "Visual System"];

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

      {/* ── FILTER TABS (static — JS filter is a future enhancement) ── */}
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
              {/* Placeholder image area — replace with real screenshots */}
              <div className="h-48 bg-ink-3 border-b border-white/5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                <span className="font-sans text-xs text-mist/30 tracking-widest uppercase">
                  {/* TODO: Replace with <Image src={item.image} alt={item.title} fill className="object-cover" /> */}
                  Preview
                </span>
              </div>

              <div className="p-7 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-[10px] text-gold tracking-widest uppercase">{item.category}</span>
                  {item.live && (
                    <span className="flex items-center gap-1.5 font-sans text-[10px] text-mist">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      Live
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
                  <span className="font-sans text-xs text-mist/40 tracking-widest uppercase">NDA / Private</span>
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
            Let's build something<br /><span className="italic">worth showing.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#booking" className="inline-block bg-gold text-ink px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300">
              Free Discovery Call
            </Link>
            <Link href="/business" className="inline-block border border-gold/50 text-gold px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-ink transition-all duration-300">
              View Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
