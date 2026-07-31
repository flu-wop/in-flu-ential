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
