"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y            = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale        = useTransform(scrollYProgress, [0, 0.8], [1, 1.12]);
  const textY        = useTransform(scrollYProgress, [0, 0.6], ["0%", "-18%"]);
  const textOpacity  = useTransform(scrollYProgress, [0, 0.4, 0.65], [1, 1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.8]);
  const springY      = useSpring(y, { stiffness: 60, damping: 20 });

  return (
    <section ref={ref} id="hero" className="relative h-[160vh] w-full">
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">

        {/* Parallax background */}
        <motion.div style={{ y: springY, scale }} className="absolute inset-0 will-change-transform">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1568695931072-a6e9b24c5a0c?w=2400&q=90&auto=format&fit=crop')`,
              filter: "saturate(0.7) brightness(0.55)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 50% 70%, rgba(180,120,40,0.15) 0%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* Overlay gradient */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: overlayOpacity,
            background: "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.7) 25%, rgba(8,8,8,0.2) 55%, rgba(8,8,8,0.5) 100%)",
          }}
        />

        {/* Radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(8,8,8,0.6) 100%)",
          }}
        />

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        {/* Gold top line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-0 left-0 right-0 h-px origin-left"
          style={{ background: "linear-gradient(to right, transparent, #D4AF77 30%, #D4AF77 70%, transparent)" }}
        />

        {/* Headline block */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="h-px w-12 bg-[#D4AF77]/60" />
            <span className="text-[#D4AF77] text-[10px] tracking-[0.5em] uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
              New Orleans · Est. 2019
            </span>
            <div className="h-px w-12 bg-[#D4AF77]/60" />
          </motion.div>

          {/* Wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="text-[clamp(3.5rem,12vw,10rem)] font-light leading-none tracking-[0.08em] text-[#F5EDD8]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              IN-FLU-ENTIAL
            </h1>
          </motion.div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.9 }}
            className="mt-5 text-[clamp(1rem,2.5vw,1.4rem)] font-light italic text-[#A89880] tracking-[0.12em]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            A Building of Influence
          </motion.p>

          {/* Sub-tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 1 }}
            className="mt-3 text-[11px] tracking-[0.35em] text-[#A89880]/70 uppercase"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Global Roots · Executive Vision · Creative Execution
          </motion.p>

          {/* Scroll prompt */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          >
            <span className="text-[9px] tracking-[0.5em] text-[#A89880]/60 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Enter
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-14 bg-gradient-to-b from-[#D4AF77]/50 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Bottom fog */}
        <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: "linear-gradient(to top, #080808, transparent)" }} />
      </div>
    </section>
  );
}
