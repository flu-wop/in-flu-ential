"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import VaultContent from "@/components/vault/VaultContent";
import CinematicNav from "@/components/cinematic/CinematicNav";
import SceneBoundary from "@/components/cinematic/SceneBoundary";

// Three.js must never server-render — load client-only
const VaultDoor3D = dynamic(() => import("@/components/vault/VaultDoor3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[100dvh] flex items-center justify-center bg-[#060606]">
      <p
        className="text-[10px] tracking-[0.5em] text-[#D4AF77]/40 uppercase animate-pulse"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        Approaching the vault…
      </p>
    </div>
  ),
});

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <main className="bg-[#060606] min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="door"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Minimal nav for vault */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 md:px-16">
              <a href="/" className="flex flex-col leading-none group">
                <span
                  className="font-display text-lg tracking-[0.25em] text-[#D4AF77]/70 uppercase group-hover:text-[#D4AF77] transition-colors"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  IN-FLU-ENTIAL
                </span>
                <span
                  className="text-[9px] tracking-[0.4em] text-[#A89880]/40 uppercase mt-0.5"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  LLC
                </span>
              </a>
              <a
                href="/"
                className="text-[10px] tracking-[0.35em] text-[#A89880]/40 uppercase hover:text-[#D4AF77] transition-colors"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                ← Home
              </a>
            </div>

            <SceneBoundary fallback={
              <div className="w-full h-[100dvh] flex items-center justify-center bg-[#060606]">
                <p className="text-[10px] tracking-[0.5em] text-[#D4AF77]/40 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Enter the combination
                </p>
              </div>
            }>
              <VaultDoor3D onUnlock={() => setUnlocked(true)} />
            </SceneBoundary>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CinematicNav />
            <VaultContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
