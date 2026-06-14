"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import CinematicNav from "@/components/cinematic/CinematicNav";
import CinematicFooter from "@/components/cinematic/CinematicFooter";

type FilterType = "All" | "Websites" | "Branding" | "Campaigns" | "Music";

const FILTERS: FilterType[] = ["All", "Websites", "Branding", "Campaigns", "Music"];

const WORK = [
  {
    id: "fluhaul",
    title: "Flu-Haul",
    category: "Websites" as FilterType,
    type: "Full Site Build",
    description: "Cinematic junk removal brand. Lenis + GSAP parallax. Full booking system with Stripe.",
    url: "https://fluhaul.com",
    tags: ["Next.js", "Framer Motion", "Stripe"],
    year: "2026",
  },
  {
    id: "midcitysound",
    title: "Mid City Sound Studios",
    category: "Websites" as FilterType,
    type: "Full Site Build",
    description: "Premium recording studio site. Online booking, session payments, room calendar.",
    url: "https://midcitysound.com",
    tags: ["Next.js", "Booking System", "Turso"],
    year: "2026",
  },
  {
    id: "epoch-skin",
    title: "Epoch Skin",
    category: "Websites" as FilterType,
    type: "Full Site Build",
    description: "Luxury waxing + organic skincare brand. Booking, product pages, Stripe checkout.",
    url: "https://epoch-skin.com",
    tags: ["Next.js", "E-commerce", "Stripe"],
    year: "2026",
  },
  {
    id: "graham-hill",
    title: "Graham Hill",
    category: "Campaigns" as FilterType,
    type: "Artist Campaign",
    description: "Debut LP campaign for Beach House drummer. Site, press, social rollout strategy.",
    url: "#",
    tags: ["Campaign", "Artist Dev", "Web"],
    year: "2026",
  },
  {
    id: "lil-squiggle",
    title: "Lil Squiggle",
    category: "Campaigns" as FilterType,
    type: "Brand + Campaign",
    description: "Reggae-dub chibi Lego creative brand. Merch, landing page, social presence.",
    url: "https://lilsquiggle.vercel.app",
    tags: ["Branding", "Merch", "Social"],
    year: "2025",
  },
  {
    id: "donaldmarkowitz",
    title: "Donald Markowitz",
    category: "Websites" as FilterType,
    type: "Artist Site",
    description: "Artist site for creative partner Donny Markowitz. Clean, minimal, press-ready.",
    url: "https://donaldmarkowitz.com",
    tags: ["Next.js", "Artist Site"],
    year: "2026",
  },
  {
    id: "prof-longhair",
    title: "Professor Longhair Documentary",
    category: "Campaigns" as FilterType,
    type: "Investor Pitch",
    description: "Full pitch deck for Fish Pot Studios. Narrative arc, market positioning, funding strategy.",
    url: "#",
    tags: ["Pitch Deck", "Strategy", "Film"],
    year: "2026",
  },
  {
    id: "mvc-creations",
    title: "MVC Creations",
    category: "Websites" as FilterType,
    type: "E-commerce Site",
    description: "Luxury press-on nail brand. Next.js 15, Shopify integration, premium visual identity.",
    url: "#",
    tags: ["Next.js", "Shopify", "Luxury"],
    year: "2026",
  },
  {
    id: "influential-brand",
    title: "IN-FLU-ENTIAL Brand System",
    category: "Branding" as FilterType,
    type: "Brand Identity",
    description: "Full brand architecture, visual language, voice guide, and design system for the studio itself.",
    url: "#",
    tags: ["Identity", "Design System", "Strategy"],
    year: "2025",
  },
];

function WorkCard({ item, index }: { item: typeof WORK[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div
        className="relative overflow-hidden h-full transition-all duration-500 group-hover:-translate-y-1"
        style={{
          background: "linear-gradient(155deg, #131108 0%, #0d0d0a 100%)",
          border: "1px solid rgba(212,175,119,0.1)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
          style={{ background: "linear-gradient(to right, transparent, #D4AF77, transparent)" }}
        />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="text-[9px] tracking-[0.4em] text-[#D4AF77]/40 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
              {item.type}
            </span>
            <span className="text-[9px] tracking-[0.3em] text-[#A89880]/30" style={{ fontFamily: "DM Sans, sans-serif" }}>
              {item.year}
            </span>
          </div>

          <h3
            className="text-xl font-light text-[#F5EDD8] mb-2 group-hover:text-[#E8C97A] transition-colors duration-500"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {item.title}
          </h3>

          <p className="text-xs text-[#A89880]/65 leading-relaxed mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {item.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {item.tags.map(tag => (
              <span
                key={tag}
                className="text-[8px] tracking-[0.25em] text-[#A89880]/40 uppercase px-2 py-1 border border-[#D4AF77]/8"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-[#D4AF77]/8">
            {item.url !== "#" ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-[#D4AF77]/50 uppercase hover:text-[#D4AF77] transition-colors duration-300"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                View Live ↗
              </a>
            ) : (
              <span className="text-[10px] tracking-[0.3em] text-[#A89880]/25 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Private / NDA
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const op  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const filtered = activeFilter === "All" ? WORK : WORK.filter(w => w.category === activeFilter);

  return (
    <main className="bg-[#080808] overflow-x-hidden">
      <CinematicNav />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[120vh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=2400&q=85&auto=format&fit=crop')`,
                filter: "saturate(0.3) brightness(0.3) sepia(0.2)",
              }}
            />
          </motion.div>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.4) 50%, rgba(8,8,8,0.65) 100%)",
          }} />

          <motion.div style={{ opacity: op }} className="absolute inset-0 flex flex-col justify-end px-8 md:px-20 pb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.9 }} className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/50" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>Portfolio</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,8rem)] font-light leading-none text-[#F5EDD8] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The work
              <br /><em className="text-[#D4AF77]">speaks</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
              className="text-[#A89880] text-base max-w-md" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Websites, campaigns, brand systems, and music — all built at the same standard, regardless of client size.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── FILTER + GRID ────────────────────────────────── */}
      <section className="relative py-20 px-8 md:px-12 lg:px-20">
        {/* Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto flex flex-wrap gap-2 mb-12"
        >
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-5 py-2.5 text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
              style={{
                fontFamily: "DM Sans, sans-serif",
                background: activeFilter === filter ? "rgba(212,175,119,0.12)" : "transparent",
                border: `1px solid ${activeFilter === filter ? "rgba(212,175,119,0.35)" : "rgba(212,175,119,0.1)"}`,
                color: activeFilter === filter ? "#D4AF77" : "#A89880",
              }}
            >
              {filter}
            </button>
          ))}
          <span className="ml-auto self-center text-[10px] tracking-[0.3em] text-[#A89880]/30 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {filtered.length} projects
          </span>
        </motion.div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((item, i) => (
                <WorkCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 md:px-20 border-t border-[#D4AF77]/8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center"
        >
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-light text-[#F5EDD8] mb-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Want to be on this list?
          </h2>
          <p className="text-[#A89880] text-sm mb-8" style={{ fontFamily: "DM Sans, sans-serif" }}>
            We take on a limited number of new projects each quarter.
          </p>
          <a
            href="/booking"
            className="inline-block px-12 py-4 text-[11px] tracking-[0.4em] uppercase text-[#080808] bg-[#D4AF77] hover:bg-[#E8C97A] transition-colors duration-300"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Start a Conversation
          </a>
        </motion.div>
      </section>

      <CinematicFooter />
    </main>
  );
}
