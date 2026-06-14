"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import CinematicNav from "@/components/cinematic/CinematicNav";
import CinematicFooter from "@/components/cinematic/CinematicFooter";

const TIMELINE = [
  { year: "Ghana", label: "Roots", detail: "Born to Ghanaian parents. Global cultural fluency from day one." },
  { year: "Toronto", label: "Formation", detail: "Early creative development. Music, business, and ambition taking shape." },
  { year: "Chicago", label: "Expansion", detail: "Industrial project management. Learned how to execute at scale under pressure." },
  { year: "New Orleans", label: "Home", detail: "The city claimed us. Studio, culture, and company — all built here." },
];

const CREDENTIALS = [
  { stat: "7+", label: "Years operating" },
  { stat: "150+", label: "Campaigns executed" },
  { stat: "$2M+", label: "Client revenue influenced" },
  { stat: "3", label: "Continents of reach" },
];

const TIERS = [
  {
    name: "Growth",
    price: "$5,000",
    period: "/ project",
    tagline: "Brand clarity and a content system that actually works.",
    includes: [
      "Brand positioning audit",
      "Social strategy + 30-day calendar",
      "30-day content sprint",
      "One full creative campaign",
    ],
  },
  {
    name: "Influence",
    price: "$12,500",
    period: "/ quarter",
    tagline: "Full-service creative direction and ongoing strategic partnership.",
    includes: [
      "Everything in Growth",
      "Monthly creative direction sessions",
      "Video + media production",
      "Press + partnership brokerage",
      "Direct access via Signal",
    ],
    featured: true,
  },
  {
    name: "Legacy",
    price: "$25,000+",
    period: "/ engagement",
    tagline: "Executive-level brand architecture for those building for decades.",
    includes: [
      "Everything in Influence",
      "Brand architecture + legacy roadmap",
      "Business development advisory",
      "Revenue stream mapping",
      "Priority access — all initiatives",
    ],
  },
];

export default function BusinessPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY   = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const op    = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);
  const springY = useSpring(bgY, { stiffness: 50, damping: 18 });

  return (
    <main className="bg-[#080808] overflow-x-hidden">
      <CinematicNav />

      {/* ── HERO ────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-[150vh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <motion.div style={{ y: springY }} className="absolute inset-0 will-change-transform">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=2400&q=85&auto=format&fit=crop')`,
                filter: "saturate(0.3) brightness(0.3) sepia(0.4)",
              }}
            />
          </motion.div>
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 70% 60% at 60% 50%, rgba(212,175,119,0.08) 0%, transparent 70%)",
          }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.5) 40%, rgba(8,8,8,0.65) 100%)",
          }} />

          <motion.div style={{ opacity: op }} className="absolute inset-0 flex flex-col justify-end px-8 md:px-20 pb-20">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.9 }} className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/50" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>Business & Branding</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3rem,10vw,8rem)] font-light leading-none text-[#F5EDD8] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Where the boardroom
              <br /><em className="text-[#D4AF77]">meets the booth</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.9 }}
              className="text-[#A89880] text-base max-w-lg"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Executive strategy, brand architecture, and creative execution — for artists, founders, and organizations who refuse to be ordinary.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── CREDENTIALS ─────────────────────────────────── */}
      <section className="relative py-20 px-8 md:px-20 border-t border-[#D4AF77]/8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {CREDENTIALS.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.8 }}
            >
              <span className="block text-4xl md:text-5xl font-light text-[#D4AF77] mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                {c.stat}
              </span>
              <span className="text-[10px] tracking-[0.3em] text-[#A89880]/50 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                {c.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── ORIGIN STORY / TIMELINE ─────────────────────── */}
      <section className="relative py-28 px-8 md:px-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="flex items-center gap-4 mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/40" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>The Origin</span>
            </div>
            <h2 className="text-[clamp(2rem,6vw,4.5rem)] font-light text-[#F5EDD8] leading-tight" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Global roots.<br /><em className="text-[#D4AF77]">Local obsession.</em>
            </h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-[#D4AF77]/10 hidden md:block" />
            <div className="space-y-8">
              {TIMELINE.map((stop, i) => (
                <motion.div
                  key={stop.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative md:w-1/2 ${i % 2 === 0 ? "md:pr-16 md:ml-0" : "md:pl-16 md:ml-auto"}`}
                >
                  {/* Dot */}
                  <div className="hidden md:block absolute top-4 w-3 h-3 rounded-full bg-[#D4AF77]/40 border border-[#D4AF77]/60"
                    style={{ [i % 2 === 0 ? "right" : "left"]: "-6px", transform: "translateX(50%)" }}
                  />
                  <div className="p-7 border border-[#D4AF77]/10 hover:border-[#D4AF77]/20 transition-colors duration-500"
                    style={{ background: "linear-gradient(155deg, #131108 0%, #0d0d0a 100%)" }}
                  >
                    <span className="text-3xl font-light text-[#D4AF77]/60 block mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>
                      {stop.year}
                    </span>
                    <span className="text-[10px] tracking-[0.4em] text-[#A89880]/50 uppercase block mb-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {stop.label}
                    </span>
                    <p className="text-sm text-[#A89880]/70 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {stop.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────── */}
      <section className="relative py-28 px-8 md:px-20">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <div className="flex items-center gap-4 justify-center mb-5">
              <div className="h-px w-10 bg-[#D4AF77]/40" />
              <span className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>Investment</span>
              <div className="h-px w-10 bg-[#D4AF77]/40" />
            </div>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-light text-[#F5EDD8]" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              Choose your engagement
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <div
                  className="h-full p-7 flex flex-col"
                  style={{
                    background: tier.featured ? "linear-gradient(155deg, #1a1508 0%, #110f06 100%)" : "linear-gradient(155deg, #111108 0%, #0a0a08 100%)",
                    border: tier.featured ? "1px solid rgba(212,175,119,0.35)" : "1px solid rgba(212,175,119,0.08)",
                  }}
                >
                  {tier.featured && (
                    <div className="absolute top-0 left-0 right-0 h-px" style={{
                      background: "linear-gradient(to right, transparent, #D4AF77 20%, #D4AF77 80%, transparent)",
                    }} />
                  )}
                  {tier.featured && (
                    <span className="absolute top-4 right-4 text-[8px] tracking-[0.3em] text-[#080808] bg-[#D4AF77] px-2 py-1 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      Popular
                    </span>
                  )}
                  <div className="mb-6">
                    <h3 className="text-2xl font-light text-[#F5EDD8] mb-1" style={{ fontFamily: "Cormorant Garamond, serif" }}>{tier.name}</h3>
                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-3xl text-[#D4AF77] font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>{tier.price}</span>
                      <span className="text-[11px] text-[#A89880]/50" style={{ fontFamily: "DM Sans, sans-serif" }}>{tier.period}</span>
                    </div>
                    <p className="text-xs text-[#A89880]/60 leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>{tier.tagline}</p>
                  </div>
                  <div className="h-px bg-[#D4AF77]/10 mb-6" />
                  <ul className="space-y-2.5 flex-1 mb-7">
                    {tier.includes.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-xs text-[#A89880]" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        <span className="text-[#D4AF77]/50 text-[8px] mt-0.5 shrink-0">◆</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/booking"
                    className="block text-center py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all duration-300"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      background: tier.featured ? "#D4AF77" : "transparent",
                      color: tier.featured ? "#080808" : "#D4AF77",
                      border: tier.featured ? "none" : "1px solid rgba(212,175,119,0.25)",
                    }}
                  >
                    Get Started
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CinematicFooter />
    </main>
  );
}
