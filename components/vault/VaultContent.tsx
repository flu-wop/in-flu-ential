"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type VaultCategory = "All" | "Pitch Deck" | "Music" | "Work in Progress" | "Strategy" | "Press Kit";

export interface VaultItem {
  id: string;
  title: string;
  category: Exclude<VaultCategory, "All">;
  description: string;
  fileUrl?: string;
  audioUrl?: string;
  coverUrl?: string;
  date: string;
  client?: string;
  isPrivate?: boolean;
}

// ── EDIT YOUR VAULT CONTENT HERE ──────────────────────────────────────────
export const VAULT_ITEMS: VaultItem[] = [
  {
    id: "longhair-pitch",
    title: "Professor Longhair Documentary",
    category: "Pitch Deck",
    description: "Investor pitch for Fish Pot Studios — narrative arc, market positioning, and funding strategy for a New Orleans music documentary.",
    fileUrl: "#",
    date: "2026-01",
    client: "Fish Pot Studios",
    isPrivate: true,
  },
  {
    id: "influential-brand-deck",
    title: "IN-FLU-ENTIAL Brand Strategy v2",
    category: "Pitch Deck",
    description: "Full brand positioning, service tiers, and 12-month growth roadmap. Internal reference deck.",
    fileUrl: "#",
    date: "2025-01",
  },
  {
    id: "track-1",
    title: "Untitled 001",
    category: "Music",
    description: "Unreleased. Production: IN-FLU-ENTIAL LLC.",
    audioUrl: "",
    date: "2026-01",
    isPrivate: true,
  },
  {
    id: "track-2",
    title: "Untitled 002",
    category: "Music",
    description: "Unreleased. Production: IN-FLU-ENTIAL LLC.",
    audioUrl: "",
    date: "2026-02",
    isPrivate: true,
  },
  {
    id: "graham-hill-wip",
    title: "Graham Hill — Debut LP Campaign",
    category: "Work in Progress",
    description: "Beach House drummer's debut solo Americana album. Site and campaign in build — pending final content.",
    date: "2026-06",
    client: "Graham Hill",
  },
  {
    id: "website-kit",
    title: "Website Starter Kit Playbook",
    category: "Strategy",
    description: "Internal build guide and pricing framework for the DIY kit product line.",
    fileUrl: "#",
    date: "2026-06",
  },
  {
    id: "press-kit",
    title: "IN-FLU-ENTIAL LLC — Press Kit",
    category: "Press Kit",
    description: "Bio, hi-res photos, credits, and contact info. For press, media, and partnership inquiries.",
    fileUrl: "#",
    date: "2026-06",
  },
];

const CATEGORIES: VaultCategory[] = ["All", "Pitch Deck", "Music", "Work in Progress", "Strategy", "Press Kit"];

const CATEGORY_ICONS: Record<VaultCategory, string> = {
  "All": "◈",
  "Pitch Deck": "◆",
  "Music": "♪",
  "Work in Progress": "◎",
  "Strategy": "▲",
  "Press Kit": "◇",
};

function AudioPlayer({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    if (!audioRef.current || !url) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
  };

  return (
    <div className="mt-4 flex items-center gap-3">
      {url ? (
        <>
          <audio ref={audioRef} src={url} onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              background: playing ? "rgba(212,175,119,0.8)" : "rgba(212,175,119,0.15)",
              border: "1px solid rgba(212,175,119,0.3)",
            }}
          >
            <span className="text-[#F5EDD8] text-xs">{playing ? "❚❚" : "▶"}</span>
          </button>
          <div className="flex-1 h-px bg-[#D4AF77]/15 relative">
            <div className="h-full bg-[#D4AF77]/60 transition-all duration-100" style={{ width: `${progress}%` }} />
          </div>
        </>
      ) : (
        <p className="text-[10px] tracking-[0.3em] text-[#A89880]/40 uppercase" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Audio coming soon
        </p>
      )}
    </div>
  );
}

function VaultCard({ item, index }: { item: VaultItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <div
        className="relative overflow-hidden h-full transition-all duration-500 group-hover:-translate-y-1"
        style={{
          background: "linear-gradient(155deg, #131108 0%, #0d0d0a 100%)",
          border: "1px solid rgba(212,175,119,0.1)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top gold line on hover */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-px origin-left"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.4 }}
          style={{ background: "linear-gradient(to right, transparent, #D4AF77, transparent)" }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[#D4AF77]/50 text-sm">{CATEGORY_ICONS[item.category]}</span>
              <span
                className="text-[9px] tracking-[0.4em] text-[#D4AF77]/50 uppercase"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {item.isPrivate && (
                <span
                  className="text-[8px] tracking-[0.3em] text-[#A89880]/40 uppercase px-2 py-0.5 border border-[#A89880]/15"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  NDA
                </span>
              )}
              {item.client && (
                <span
                  className="text-[8px] tracking-[0.25em] text-[#D4AF77]/35 uppercase"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  {item.client}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-light text-[#F5EDD8] mb-2 leading-snug group-hover:text-[#E8C97A] transition-colors duration-500"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            {item.title}
          </h3>

          {/* Description */}
          <p
            className="text-xs text-[#A89880]/65 leading-relaxed"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            {item.description}
          </p>

          {/* Audio player for music */}
          {item.category === "Music" && (
            <AudioPlayer url={item.audioUrl || ""} title={item.title} />
          )}

          {/* File link */}
          {item.fileUrl && item.fileUrl !== "#" && (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-[10px] tracking-[0.3em] text-[#D4AF77]/60 uppercase hover:text-[#D4AF77] transition-colors duration-300"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              <span>Open</span>
              <span>↗</span>
            </a>
          )}
          {item.fileUrl === "#" && (
            <p
              className="mt-4 text-[10px] tracking-[0.3em] text-[#A89880]/30 uppercase"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Link pending
            </p>
          )}

          {/* Date */}
          <div className="mt-4 pt-4 border-t border-[#D4AF77]/8">
            <span
              className="text-[9px] tracking-[0.3em] text-[#A89880]/30 uppercase"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              {item.date}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function VaultContent() {
  const [activeCategory, setActiveCategory] = useState<VaultCategory>("All");

  const filtered = activeCategory === "All"
    ? VAULT_ITEMS
    : VAULT_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-32 px-6 md:px-12 lg:px-20">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto mb-16"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px w-10 bg-[#D4AF77]/40" />
          <span
            className="text-[10px] tracking-[0.5em] text-[#D4AF77] uppercase"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Private Vault — Unlocked
          </span>
        </div>
        <h1
          className="text-[clamp(2.5rem,7vw,5rem)] font-light text-[#F5EDD8] leading-none mb-4"
          style={{ fontFamily: "Cormorant Garamond, serif" }}
        >
          Inside the vault
        </h1>
        <p
          className="text-[#A89880] text-sm max-w-lg"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          Confidential work, unreleased music, and internal strategy. Handle accordingly.
        </p>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="max-w-5xl mx-auto mb-10 flex flex-wrap gap-2"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 text-[10px] tracking-[0.3em] uppercase transition-all duration-300"
            style={{
              fontFamily: "DM Sans, sans-serif",
              background: activeCategory === cat ? "rgba(212,175,119,0.15)" : "transparent",
              border: `1px solid ${activeCategory === cat ? "rgba(212,175,119,0.4)" : "rgba(212,175,119,0.1)"}`,
              color: activeCategory === cat ? "#D4AF77" : "#A89880",
            }}
          >
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((item, i) => (
              <VaultCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="max-w-5xl mx-auto mt-20 pt-10 border-t border-[#D4AF77]/10"
      >
        <a
          href="/"
          className="text-[11px] tracking-[0.4em] text-[#A89880]/40 uppercase hover:text-[#D4AF77] transition-colors duration-300"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          ← Back to Home
        </a>
      </motion.div>
    </div>
  );
}
