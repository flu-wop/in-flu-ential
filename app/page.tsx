"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Link from "next/link";
import { motion } from "framer-motion";
import CinematicNav from "@/components/cinematic/CinematicNav";
import HeroScene from "@/components/cinematic/HeroScene";
import ApproachScene from "@/components/cinematic/ApproachScene";
import HallwayScene from "@/components/cinematic/HallwayScene";
import VaultScene from "@/components/cinematic/VaultScene";
import CinematicFooter from "@/components/cinematic/CinematicFooter";

export default function Home() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-[#080808] overflow-x-hidden">
      <CinematicNav />
      <HeroScene />
      <ApproachScene />
      <HallwayScene />

      {/* Restrained Vault teaser — single moment that surfaces the real /vault */}
      <section className="relative py-24 md:py-32 px-6 md:px-16 border-t border-[#D4AF77]/10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Static vault door preview — not the interactive 3D door, just a quiet still */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mx-auto mb-8 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
            style={{
              border: "1px solid rgba(212,175,119,0.3)",
              boxShadow: "0 0 40px rgba(212,175,119,0.06), inset 0 0 24px rgba(0,0,0,0.5)",
            }}
          >
            <div
              className="w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(212,175,119,0.5)",
                background: "radial-gradient(circle, rgba(212,175,119,0.08) 0%, rgba(8,8,8,0.8) 100%)",
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "radial-gradient(circle at 30% 30%, #E8C97A, #8B6914)",
                  boxShadow: "0 0 12px rgba(212,175,119,0.4)",
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="flex items-center gap-4 justify-center mb-6"
          >
            <div className="h-px w-10 bg-[#D4AF77]/40" />
            <span
              className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Private Access
            </span>
            <div className="h-px w-10 bg-[#D4AF77]/40" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1 }}
            className="text-[clamp(2rem,5vw,3.5rem)] font-light text-[#F5EDD8] leading-tight mb-5"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            The Vault
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.9 }}
            className="text-[#A89880] text-sm md:text-base max-w-md mx-auto mb-10"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Pitch decks, unreleased work, and private materials. Invitation only.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.9 }}
          >
            <Link
              href="/vault"
              className="inline-flex items-center gap-4 group text-[11px] tracking-[0.35em] uppercase text-[#D4AF77] hover:text-[#E8C97A] transition-colors duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Enter the Vault
              <span className="text-[#D4AF77]/50 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <VaultScene />
      <CinematicFooter />
    </main>
  );
}
