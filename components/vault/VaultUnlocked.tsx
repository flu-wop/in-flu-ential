"use client";

import { motion } from "framer-motion";
import CinematicNav from "@/components/cinematic/CinematicNav";
import PatchBay from "@/components/studio/PatchBay";
import VaultContent from "@/components/vault/VaultContent";
import type { VaultItem } from "@/lib/vault-items";

export default function VaultUnlocked({ items }: { items: VaultItem[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
      <CinematicNav />
      <div className="max-w-[960px] mx-auto px-4 md:px-10 pt-24">
        <PatchBay />
      </div>
      <VaultContent items={items} />
    </motion.div>
  );
}
