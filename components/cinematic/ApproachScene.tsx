"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const stats = [
  { value: "7+", label: "Years Shaping Brands" },
  { value: "150+", label: "Campaigns Executed" },
  { value: "$2M+", label: "Client Revenue Generated" },
  { value: "3", label: "Core Verticals" },
];

export default function ApproachScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1.04, 1]);

  const springBgY = useSpring(bgY, { stiffness: 50, damping: 18 });

  return (
    <section
      ref={ref}
      id="approach"
      className="relative min-h-[180vh] w-full"
    >
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Background — mansion facade */}
        <motion.div
          style={{ y: springBgY, scale }}
          className="absolute inset-0 will-change-transform"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/mansion-facade.webp')`,
              filter: "saturate(0.5) brightness(0.35) sepia(0.3)",
            }}
          />
        </motion.div>

        {/* Layered overlays */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.2) 50%, rgba(8,8,8,0.75) 100%)",
          }}
        />
        {/* Warm window glow effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 55% 45%, rgba(212,175,119,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Bottom vignette */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: "linear-gradient(to top, #080808, transparent)" }}
        />
        {/* Top vignette */}
        <div
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, #080808, transparent)" }}
        />

        {/* Content */}
        <motion.div
          style={{ y: contentY, opacity }}
          className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 lg:px-28"
        >
          {/* Left block */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="h-px w-10 bg-[#D4AF77]" />
              <span
                className="text-[10px] tracking-[0.45em] text-[#D4AF77] uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                The Approach
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.4rem,6vw,5rem)] font-light leading-[1.05] text-[#F5EDD8] mb-6"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              Where strategy
              <br />
              <em className="text-[#D4AF77]">becomes culture</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.9 }}
              className="text-[#A89880] text-base md:text-lg leading-relaxed max-w-lg"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              We don&apos;t just build campaigns. We architect cultural moments — 
              deeply rooted in New Orleans, engineered for global resonance. 
              Every touchpoint a deliberate expression of who you are.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.8 }}
              href="#hallway"
              className="inline-flex items-center gap-4 mt-10 group"
            >
              <span
                className="text-[11px] tracking-[0.4em] text-[#D4AF77] uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Explore Services
              </span>
              <motion.span
                className="block h-px bg-[#D4AF77] w-8 origin-left"
                whileHover={{ scaleX: 1.5 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          </div>

          {/* Stats row — bottom */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 1 }}
            className="absolute bottom-16 left-8 right-8 md:left-20 md:right-20"
          >
            <div className="h-px bg-[#D4AF77]/20 w-full mb-8" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.7 }}
                  className="flex flex-col gap-1"
                >
                  <span
                    className="text-3xl md:text-4xl text-[#D4AF77] font-light"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-[10px] tracking-[0.25em] text-[#A89880]/70 uppercase"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
