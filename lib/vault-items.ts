// Server-only: imported by app/vault/page.tsx and passed to the client only
// after the vault cookie checks out. Never import this from a "use client" file.
import type { PolaroidItem } from "@/lib/polaroids";

export type VaultCategory = "All" | "Music" | "Work in Progress" | "Strategy" | "Press Kit";

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


// The Contact Sheet: Polaroids shown only inside the vault. Photos here are
// private, so don't put them in /public or the repo (both are public): host
// them somewhere private and set photo to that URL. Square, ~1000x1000.
export const CONTACT_SHEET: PolaroidItem[] = [
  { id: "frame-01", caption: "Frame 01", note: "Photo and note coming soon." },
  { id: "frame-02", caption: "Frame 02", note: "Photo and note coming soon." },
  { id: "frame-03", caption: "Frame 03", note: "Photo and note coming soon." },
  { id: "frame-04", caption: "Frame 04", note: "Photo and note coming soon." },
  { id: "frame-05", caption: "Frame 05", note: "Photo and note coming soon." },
  { id: "frame-06", caption: "Frame 06", note: "Photo and note coming soon." },
];

// The Wall: studio and behind-the-scenes Polaroids, shown only inside the vault.
// Same rule as the Contact Sheet: photos are private, so host them somewhere
// private and set photo to that URL. Square, ~1000x1000.
export const WALL: PolaroidItem[] = [
  { id: "control-room", caption: "Control Room", note: "Where the mix gets decided." },
  { id: "live-room", caption: "Live Room", note: "Where the takes happen." },
  { id: "behind-the-glass", caption: "Behind the Glass", note: "The engineer's view." },
  { id: "between-takes", caption: "Between Takes", note: "The part nobody posts." },
];
