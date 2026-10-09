"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import SceneBoundary from "@/components/cinematic/SceneBoundary";
import CinematicNav from "@/components/cinematic/CinematicNav";

// Three.js must never server-render — load client-only. Loading fallback is
// a blank matching backdrop, not text — a loading *label* is what reads as
// "stuck" if the chunk takes a moment; a plain matching background doesn't.
const VaultDoor3D = dynamic(() => import("@/components/vault/VaultDoor3D"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-[100dvh]"
      style={{ background: "radial-gradient(ellipse 120% 100% at 50% 55%, #1a1208 0%, #080808 60%, #030303 100%)" }}
    />
  ),
});

// Door + password prompt. On success the server sets the vault cookie and we
// refresh, so app/vault/page.tsx re-renders on the server with the content.
export default function VaultGate() {
  const router = useRouter();

  return (
    <main className="bg-[#060606] min-h-screen overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <CinematicNav />

        <SceneBoundary
          fallback={
            <div className="w-full h-[100dvh] flex items-center justify-center bg-[#060606] px-6">
              <p
                className="text-[#A89880] text-sm tracking-[0.3em] uppercase text-center"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                Enter the combination below
              </p>
            </div>
          }
        >
          <VaultDoor3D onUnlock={() => router.refresh()} />
        </SceneBoundary>
      </motion.div>
    </main>
  );
}
