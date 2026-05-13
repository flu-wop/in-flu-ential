// ─────────────────────────────────────────────
// VAULT CONTENT — add new items here freely
// Each item: { id, title, category, description, fileUrl (optional), date }
// ─────────────────────────────────────────────

export type VaultItem = {
  id: string;
  title: string;
  category: "Pitch Deck" | "Strategy" | "Work in Progress" | "Soho House" | "Other";
  description: string;
  fileUrl?: string; // link to PDF, Figma, Notion, Google Doc, etc.
  date: string;
};

export const VAULT_ITEMS: VaultItem[] = [
  {
    id: "1",
    title: "IN-FLU-ENTIAL Brand Strategy Deck v2",
    category: "Pitch Deck",
    description: "Full brand positioning, service tiers, and 12-month growth roadmap.",
    fileUrl: "#", // replace with real URL
    date: "2025-01",
  },
  {
    id: "2",
    title: "Soho House Membership Brief",
    category: "Soho House",
    description: "Materials prepared for Soho House partnership exploration.",
    fileUrl: "#",
    date: "2025-02",
  },
  {
    id: "3",
    title: "Client X – Rebrand WIP",
    category: "Work in Progress",
    description: "Ongoing visual identity work. Phase 1 complete, Phase 2 in review.",
    date: "2025-03",
  },
];

// ─────────────────────────────────────────────
// VAULT PASSWORD
// Change this string to update the vault password.
// For production: move to an environment variable → process.env.VAULT_PASSWORD
// ─────────────────────────────────────────────
export const VAULT_PASSWORD = "influential2025";
