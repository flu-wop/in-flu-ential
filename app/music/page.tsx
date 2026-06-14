"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CinematicNav from "@/components/cinematic/CinematicNav";
import CinematicFooter from "@/components/cinematic/CinematicFooter";

const CREDITS = [
  {
    artist: "Curren$y",
    role: "In-House Producer / Engineer",
    description: "Sustained creative partnership. Production, engineering, and session coordination across multiple projects.",
    genre: "Hip-Hop / Rap",
    era: "2018–2021",
  },
  {
    artist: "Zaytoven",
    role: "Recording Engineer",
    description: "Studio sessions with the legendary Atlanta producer behind Gucci Mane, Future, and YG.",
    genre: "Hip-Hop / Trap",
    era: "2019",
  },
  {
    artist: "NoCap",
    role: "Recording Engineer",
    description: "Session work with the rising Alabama rapper during his breakthrough period.",
    genre: "Hip-Hop / Rap",
    era: "2020",
  },
  {
    artist: "Boosie Badazz",
    role: "Recording Engineer",
    description: "Studio work with the Baton Rouge legend and Louisiana rap icon.",
    genre: "Hip-Hop / Southern Rap",
    era: "2019–2020",
  },
];

const SERVICES = [
  {
    number: "01",
    title: "Recording & Engineering",
    description: "Professional recording sessions at Mid City Sound Studios, New Orleans. Pro Tools, industry-standard acoustics, experienced engineer on every session.",
    detail: "From single-mic demos to full band tracking.",
  },
  {
    number: "02",
    title: "Artist Development",
    description: "Brand identity, image direction, press kit, social strategy, and release roadmap. Built for artists who are serious about longevity.",
    detail: "Strategy first. Content second. Culture third.",
  },
  {
    number: "03",
    title: "Music Supervision",
    description: "Sync licensing, music placement for film, TV, and brand campaigns. We know both sides of the table.",
    detail: "Placement that actually fits.",
  },
  {
    number: "04",
    title: "Release Strategy",
    description: "From pre-save to playlist pitching to DSP optimization. We map your release so every day has a purpose.",
    detail: "Single, EP, or album. We plan the full arc.",
  },
];

export default function MusicPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY     = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 1.1]);
  const heroOp    = useTransform(heroScroll, [0, 0.6, 1], [1, 1, 0]);
  const springY   = useSpring(heroY, { stiffness: 50, damping: 18 });

  return (
    <main className="bg-[#080808] overflow-x-hidden">
      <CinematicNav />

      {/* ── HERO ────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div style={{ y: springY, scale: heroScale }} className="absolute inset-0 will-change-transform">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=2400&q=85&auto=format&fit=crop')`,
                filter: "saturate(0.4) brightness(0.35) sepia(0.3)",
              }}
            />
          </motion.div>

          {/* Red/amber studio light overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 60% 80% at 40% 60%, rgba(180,60,20,0.18) 0%, transparent 70%)",
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.5) 40%, rgba(8,8,8,0.2) 70%, rgba(8,8,8,0.6) 100%)",
          }} />

          <motion.div style={{ opacity: heroOp }} className="absolute inset-0 flex flex-col justify-end px-8 md:px-20 pb-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.9 }}
              className="flex items-center gap-4 mb-5"
            >
              <div className="h-px w-10 bg-[#D4AF77]/50" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Music & Production
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,8rem)] font-light leading-none text-[#F5EDD8] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Built in the
              <br />
              <em className="text-[#D4AF77]">studio</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="text-[#A89880] text-base max-w-md"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Engineering credits, artist development, and music supervision — rooted in real studio experience, not theory.
            </motion.p>

            <motion.a
              href="https://midcitysound.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="inline-flex items-center gap-4 mt-8 group"
            >
              <span className="text-[11px] tracking-[0.4em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Book at Mid City Sound
              </span>
              <span className="text-[#D4AF77]/40 group-hover:text-[#D4AF77] transition-colors">↗</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── CREDITS ─────────────────────────────────────── */}
      <section className="relative py-32 px-8 md:px-20">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/40" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Studio Credits
              </span>
            </div>
            <h2 className="text-[clamp(2.2rem,6vw,4.5rem)] font-light text-[#F5EDD8] leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              The people we've
              <br /><em className="text-[#D4AF77]">worked with</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {CREDITS.map((credit, i) => (
              <motion.div
                key={credit.artist}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden"
                style={{
                  background: "linear-gradient(155deg, #131108 0%, #0d0d0a 100%)",
                  border: "1px solid rgba(212,175,119,0.1)",
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  style={{ background: "linear-gradient(to right, transparent, #D4AF77, transparent)" }}
                />
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-light text-[#F5EDD8] group-hover:text-[#E8C97A] transition-colors duration-500" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      {credit.artist}
                    </h3>
                    <span className="text-[9px] tracking-[0.3em] text-[#A89880]/40 uppercase mt-1" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {credit.era}
                    </span>
                  </div>
                  <p className="text-[10px] tracking-[0.3em] text-[#D4AF77]/60 uppercase mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {credit.role}
                  </p>
                  <p className="text-sm text-[#A89880]/70 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {credit.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-[#D4AF77]/8">
                    <span className="text-[9px] tracking-[0.3em] text-[#A89880]/30 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {credit.genre}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────── */}
      <section className="relative py-24 px-8 md:px-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/40" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                What We Offer
              </span>
            </div>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-light text-[#F5EDD8] leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Music services that
              <br /><em className="text-[#D4AF77]">actually move things</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map((svc, i) => (
              <motion.div
                key={svc.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.8 }}
                className="p-7 border border-[#D4AF77]/8 hover:border-[#D4AF77]/20 transition-colors duration-500"
                style={{ background: "linear-gradient(155deg, #111108 0%, #0a0a08 100%)" }}
              >
                <span className="text-[10px] tracking-[0.4em] text-[#D4AF77]/40 uppercase block mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  {svc.number}
                </span>
                <h3 className="text-xl font-light text-[#F5EDD8] mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {svc.title}
                </h3>
                <p className="text-sm text-[#A89880]/65 leading-relaxed mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  {svc.description}
                </p>
                <p className="text-[10px] tracking-[0.2em] text-[#D4AF77]/40 italic" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                  {svc.detail}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.9 }}
            className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            <a
              href="/booking"
              className="px-10 py-4 text-[11px] tracking-[0.4em] uppercase text-[#080808] bg-[#D4AF77] hover:bg-[#E8C97A] transition-colors duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Book a Session
            </a>
            <a
              href="https://midcitysound.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] tracking-[0.4em] uppercase text-[#D4AF77]/60 hover:text-[#D4AF77] transition-colors duration-300 border-b border-[#D4AF77]/20 pb-0.5"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Visit Mid City Sound ↗
            </a>
          </motion.div>
        </div>
      </section>

      <CinematicFooter />
    </main>
  );
}
