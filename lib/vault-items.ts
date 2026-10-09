// Server-only: imported by app/vault/page.tsx and passed to the client only
// after the vault cookie checks out. Never import this from a "use client" file.

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

