// ─────────────────────────────────────────────
// VAULT CONTENT
// Add items here. fileUrl can be a Google Drive link, Notion page,
// Figma share link, PDF URL, or any external URL.
// For music tracks, use the "Music" category and set audioUrl.
// ─────────────────────────────────────────────

export type VaultItem = {
  id: string;
  title: string;
  category: "Pitch Deck" | "Strategy" | "Work in Progress" | "Music" | "Press Kit" | "Other";
  description: string;
  fileUrl?: string;   // PDF, Notion, Figma, Google Doc, etc.
  audioUrl?: string;  // Direct audio file URL (mp3, wav, m4a)
  coverUrl?: string;  // Optional cover art for music tracks
  date: string;       // "YYYY-MM" format
  client?: string;    // Optional — shown as a subtle tag
  private?: boolean;  // If true, shows NDA badge
};

export const VAULT_ITEMS: VaultItem[] = [
  // ── Pitch Decks ───────────────────────────────
  {
    id: "longhair-pitch",
    title: "Professor Longhair Documentary",
    category: "Pitch Deck",
    description: "Investor pitch for Fish Pot Studios — narrative arc, market positioning, and funding strategy for a New Orleans music documentary.",
    fileUrl: "#", // replace with real link
    date: "2026-01",
    client: "Fish Pot Studios",
    private: true,
  },
  {
    id: "influential-brand-deck",
    title: "IN-FLU-ENTIAL Brand Strategy v2",
    category: "Pitch Deck",
    description: "Full brand positioning, service tiers, and 12-month growth roadmap. Internal reference deck.",
    fileUrl: "#",
    date: "2025-01",
  },

  // ── Music ─────────────────────────────────────
  // Add your unreleased tracks here.
  // audioUrl can be a Dropbox direct link, Google Drive direct link,
  // or any publicly accessible audio URL.
  // Example: https://dl.dropboxusercontent.com/s/YOURFILE.mp3
  {
    id: "track-1",
    title: "Untitled 001",
    category: "Music",
    description: "Unreleased. Production: IN-FLU-ENTIAL LLC.",
    audioUrl: "", // ← paste your audio URL here
    date: "2026-01",
    private: true,
  },
  {
    id: "track-2",
    title: "Untitled 002",
    category: "Music",
    description: "Unreleased. Production: IN-FLU-ENTIAL LLC.",
    audioUrl: "", // ← paste your audio URL here
    date: "2026-02",
    private: true,
  },

  // ── Works in Progress ─────────────────────────
  {
    id: "graham-hill-wip",
    title: "Graham Hill — Debut LP Campaign",
    category: "Work in Progress",
    description: "Beach House drummer's debut solo Americana album. Site and campaign in build — pending final content from client.",
    date: "2026-06",
    client: "Graham Hill",
  },

  // ── Strategy ──────────────────────────────────
  {
    id: "website-kit-playbook",
    title: "Website Starter Kit Playbook",
    category: "Strategy",
    description: "Internal build guide and pricing framework for the DIY kit product line.",
    fileUrl: "#",
    date: "2026-06",
  },

  // ── Press Kit ─────────────────────────────────
  {
    id: "press-kit",
    title: "IN-FLU-ENTIAL LLC — Press Kit",
    category: "Press Kit",
    description: "Bio, hi-res photos, credits, and contact info. For press, media, and partnership inquiries.",
    fileUrl: "#", // link to Google Drive folder or PDF
    date: "2026-01",
  },
];

// ─────────────────────────────────────────────
// VAULT PASSWORD
// Change this to anything you want.
// For stronger security: set VAULT_PASSWORD as a Vercel env var
// and reference it as process.env.VAULT_PASSWORD here.
// ─────────────────────────────────────────────
export const VAULT_PASSWORD = "influential2025";
