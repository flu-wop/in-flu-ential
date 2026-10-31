// Server-only: imported by app/vault/page.tsx and passed to the client only
// after the vault cookie checks out. Never import this from a "use client" file.
import type { PolaroidItem } from "@/lib/polaroids";

export type VaultCategory = "All" | "Music" | "Work in Progress" | "Strategy" | "Press Kit";

const media = (path: string) => `/api/vault-media/${path}`;

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
// The two Music cards are the Unreleased playlist, still placeholders. When the
// previews are ready, upload them to unreleased/<name>.mp3 and set audioUrl to
// media("unreleased/<name>.mp3") (compressed previews, not masters).
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


// Private vault media lives in a private Blob store (never /public or the repo)
// and is served by /api/vault-media only after the vault unlocks. Upload with
// `npm run vault:upload -- <folder>` (wall/*.webp, contact/*.webp, demolition/*.mp4,
// unreleased/*.mp3). Until a file is uploaded the card shows its placeholder.
// The Contact Sheet: Polaroids shown only inside the vault. Square, ~1000x1000.
export const CONTACT_SHEET: PolaroidItem[] = [
  { id: "grammy", caption: "Grammy Award", note: "", photo: media("contact/grammy-31st.webp") },
  { id: "curreny-fee", caption: "Curren$y x Fee", note: "", photo: media("contact/curreny-x-fee.webp") },
  { id: "flaujae-oscar", caption: "Flau'jae x Donny's Oscar", note: "", photo: media("contact/flaujae-donnys-oscar.webp") },
  { id: "patrick-troy", caption: "Patrick Collier x Troy Anderson", note: "", photo: media("contact/patrick-collier-troy-anderson.webp") },
  { id: "irma", caption: "Irma x Flu", note: "", photo: media("contact/irma.webp") },
  { id: "desk", caption: "At the Desk", note: "", photo: media("contact/at-the-desk.webp") },
];

// On The Wall: studio and behind-the-scenes Polaroids, private. Square, ~1000x1000.
export const WALL: PolaroidItem[] = [
  ["zaytoven", "Zaytoven x Flu"],
  ["ugly-god", "Ugly God x Flu"],
  ["jay-elec", "Jay Elec x Flu"],
  ["fuse808-mafia", "Fuse 808 Mafia x Flu"],
  ["mac-phipps", "Mac Phipps x Disha x Flu"],
  ["kwon-alexander", "Kwon Alexander x Flu"],
  ["blac-chyna", "Blac Chyna x Flu"],
  ["narduwar", "Narduwar x Flu"],
  ["fee-banks", "Fee Banks x Flu"],
].map(([slug, caption]) => ({ id: slug, caption, note: "", photo: media(`wall/${slug}.webp`) }));

// The Demolition Wall: clips only (H.264 mp4, compressed, no location data).
export interface WallClip {
  id: string;
  title: string;
  src: string;
}
export const DEMOLITION_WALL: WallClip[] = [
  { id: "flu-haul-job", title: "Flu-Haul Job", src: media("demolition/flu-haul-job.mp4") },
  { id: "flu-haul-job-2", title: "Flu-Haul Job 2", src: media("demolition/flu-haul-job-2.mp4") },
  { id: "recycling-at-emr", title: "Recycling at EMR", src: media("demolition/recycling-at-emr.mp4") },
];
