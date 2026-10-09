"use client";

import { motion } from "framer-motion";
import CinematicNav from "@/components/cinematic/CinematicNav";
import VaultContent from "@/components/vault/VaultContent";
import type { VaultItem } from "@/lib/vault-items";

export default function VaultUnlocked({ items }: { items: VaultItem[] }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
      <CinematicNav />
      <VaultContent items={items} />
    </motion.div>
  );
}
