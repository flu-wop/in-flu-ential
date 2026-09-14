"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VaultContent from "@/components/vault/VaultContent";
import VaultGate from "@/components/vault/VaultGate";
import CinematicNav from "@/components/cinematic/CinematicNav";

export default function VaultPage() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <main className="bg-[#060606] min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <VaultGate onUnlock={() => setUnlocked(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <CinematicNav />
            <VaultContent />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
