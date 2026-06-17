"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

const VAULT_TIERS = [
  {
    tier: "Growth",
    price: "$5,000",
    period: "/ project",
    description: "Brand clarity, social strategy, and a content system that actually works.",
    features: ["Brand positioning audit", "Social strategy + calendar", "30-day content sprint", "One creative campaign"],
    highlight: false,
  },
  {
    tier: "Influence",
    price: "$12,500",
    period: "/ quarter",
    description: "Full-service creative direction, media production, and ongoing strategic partnership.",
    features: ["Everything in Growth", "Monthly creative direction sessions", "Video + media production", "Press + partnership brokerage", "Direct access — Signal"],
    highlight: true,
  },
  {
    tier: "Legacy",
    price: "$25,000+",
    period: "/ engagement",
    description: "Executive-level brand architecture for artists, founders, and organizations building for decades.",
    features: ["Everything in Influence", "Brand architecture and legacy roadmap", "Business development advisory", "Revenue stream mapping", "Priority access — all initiatives"],
    highlight: false,
  },
];

export default function VaultScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [hoveredTier, setHoveredTier] = useState<number | null>(1);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const doorScale = useTransform(scrollYProgress, [0, 0.3], [0.92, 1]);
  const doorOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.1, 0.5], [30, 0]);

  const springBgY = useSpring(bgY, { stiffness: 40, damping: 18 });

  return (
    <section ref={ref} id="vault" className="relative bg-[#080808] overflow-hidden">
      {/* Top separator */}
      <div
        className="h-px w-full"
        style={{
          background: "linear-gradient(to right, transparent, rgba(212,175,119,0.3) 30%, rgba(212,175,119,0.3) 70%, transparent)",
        }}
      />

      {/* Atmospheric vault background */}
      <div className="relative overflow-hidden h-[70vh] min-h-[480px]">
        <motion.div
          style={{ y: springBgY }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/vault.webp')`,
              filter: "saturate(0.35) brightness(0.25) sepia(0.5)",
            }}
          />
        </motion.div>

        {/* Deep vignettes */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(8,8,8,0) 20%, rgba(8,8,8,0.85) 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none"
          style={{ background: "linear-gradient(to top, #080808, transparent)" }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #080808, transparent)" }}
        />
        {/* Warm dramatic light beam */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 40% 90% at 50% 20%, rgba(212,175,119,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Vault door visual + headline */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {/* Vault door ornament */}
          <motion.div
            style={{ scale: doorScale, opacity: doorOpacity }}
            className="relative mb-8"
          >
            {/* Outer ring */}
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(212,175,119,0.3)",
                boxShadow: "0 0 60px rgba(212,175,119,0.08), inset 0 0 40px rgba(0,0,0,0.5)",
              }}
            >
              {/* Inner ring */}
              <div
                className="w-16 h-16 md:w-22 md:h-22 rounded-full flex items-center justify-center"
                style={{
                  border: "1px solid rgba(212,175,119,0.5)",
                  background: "radial-gradient(circle, rgba(212,175,119,0.08) 0%, rgba(8,8,8,0.8) 100%)",
                }}
              >
                {/* Center mark */}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 30% 30%, #E8C97A, #8B6914)",
                    boxShadow: "0 0 20px rgba(212,175,119,0.4)",
                  }}
                />
              </div>
            </div>
            {/* Spoke lines */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <motion.div
                key={deg}
                className="absolute inset-0 flex items-center justify-center"
                style={{ rotate: deg }}
                animate={{ rotate: [deg, deg + 360] }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
              >
                <div
                  className="w-full h-px origin-right"
                  style={{
                    background: "linear-gradient(to right, transparent 45%, rgba(212,175,119,0.2) 50%, transparent 55%)",
                  }}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            style={{ y: contentY }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="flex items-center gap-4 justify-center mb-5"
            >
              <div className="h-px w-10 bg-[#D4AF77]/40" />
              <span
                className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                The Vault
              </span>
              <div className="h-px w-10 bg-[#D4AF77]/40" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.4rem,7vw,5.5rem)] font-light text-[#F5EDD8] leading-tight mb-4"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The door that
              <br />
              <em className="text-[#D4AF77]">changes everything</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.9 }}
              className="text-[#A89880] text-sm md:text-base max-w-md mx-auto"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Select the engagement that fits where you are. We grow with you.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="relative z-10 px-6 md:px-12 lg:px-20 pb-28 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {VAULT_TIERS.map((tier, i) => (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredTier(i)}
              onMouseLeave={() => setHoveredTier(1)}
              className="relative cursor-default group"
            >
              <div
                className="relative overflow-hidden h-full transition-all duration-500"
                style={{
                  background: tier.highlight
                    ? "linear-gradient(155deg, #16120a 0%, #0f0d06 100%)"
                    : "linear-gradient(155deg, #111111 0%, #0d0d0d 100%)",
                  border: tier.highlight
                    ? "1px solid rgba(212,175,119,0.4)"
                    : "1px solid rgba(212,175,119,0.1)",
                  boxShadow: tier.highlight
                    ? "0 8px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,119,0.05)"
                    : "0 8px 40px rgba(0,0,0,0.5)",
                  transform:
                    hoveredTier === i ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Top gold line for highlighted */}
                {tier.highlight && (
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: "linear-gradient(to right, transparent, #D4AF77 20%, #D4AF77 80%, transparent)",
                    }}
                  />
                )}

                {/* Popular badge */}
                {tier.highlight && (
                  <div className="absolute top-4 right-4">
                    <span
                      className="text-[9px] tracking-[0.3em] text-[#080808] bg-[#D4AF77] px-3 py-1 uppercase"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col h-full">
                  {/* Tier header */}
                  <div className="mb-6">
                    <span
                      className="text-[9px] tracking-[0.45em] text-[#A89880]/50 uppercase block mb-3"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      0{i + 1} — Tier
                    </span>
                    <h3
                      className="text-2xl font-light text-[#F5EDD8] mb-4"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      {tier.tier}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span
                        className="text-3xl text-[#D4AF77] font-light"
                        style={{ fontFamily: "Cormorant Garamond, serif" }}
                      >
                        {tier.price}
                      </span>
                      <span
                        className="text-[11px] text-[#A89880]/60"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        {tier.period}
                      </span>
                    </div>
                    <p
                      className="text-xs text-[#A89880]/70 leading-relaxed"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      {tier.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px mb-6"
                    style={{
                      background: tier.highlight
                        ? "rgba(212,175,119,0.2)"
                        : "rgba(212,175,119,0.08)",
                    }}
                  />

                  {/* Features */}
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-xs text-[#A89880]"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        <span className="text-[#D4AF77]/60 mt-0.5 shrink-0 text-[8px]">◆</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="/booking"
                    className="block text-center py-3.5 text-[11px] tracking-[0.3em] uppercase transition-all duration-300"
                    style={{
                      fontFamily: "DM Sans, sans-serif",
                      background: tier.highlight ? "#D4AF77" : "transparent",
                      color: tier.highlight ? "#080808" : "#D4AF77",
                      border: tier.highlight ? "none" : "1px solid rgba(212,175,119,0.3)",
                    }}
                  >
                    {tier.tier === "Legacy" ? "Apply for Advisory" : "Get Started"}
                  </a>
                  <p
                    className="text-center text-[10px] text-[#A89880]/30 mt-2"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    No commitment until scoped together.
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="text-center mt-20"
        >
          <p
            className="text-[#A89880]/60 text-sm mb-6"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Not sure where to start?
          </p>
          <a
            href="/booking"
            className="inline-flex items-center gap-5 group"
          >
            <span
              className="text-2xl md:text-3xl font-light text-[#F5EDD8] group-hover:text-[#D4AF77] transition-colors duration-500"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Let&apos;s have a conversation
            </span>
            <motion.span
              className="text-[#D4AF77]/40 text-2xl"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              →
            </motion.span>
          </a>
          <p
            className="text-[10px] text-[#A89880]/30 mt-3 tracking-[0.3em] uppercase"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Reply within one business day. Always a human.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
