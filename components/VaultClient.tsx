"use client";
import { useState } from "react";
import { VAULT_ITEMS, VAULT_PASSWORD } from "@/lib/vault-items";
import type { VaultItem } from "@/lib/vault-items";

// Category badge colors
const CATEGORY_COLORS: Record<VaultItem["category"], string> = {
  "Pitch Deck":       "text-gold border-gold/40",
  "Strategy":         "text-blue-300 border-blue-300/40",
  "Work in Progress": "text-amber-300 border-amber-300/40",
  "Soho House":       "text-purple-300 border-purple-300/40",
  "Other":            "text-mist border-white/20",
};

function VaultItemCard({ item }: { item: VaultItem }) {
  return (
    <div className="border border-white/8 bg-ink-2 p-7 hover:border-gold/30 transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className={`font-sans text-[10px] tracking-widest uppercase border px-3 py-1 ${CATEGORY_COLORS[item.category]}`}>
          {item.category}
        </span>
        <span className="font-sans text-[10px] text-mist/50">{item.date}</span>
      </div>
      <h3 className="font-display text-xl text-cream font-light mb-2 group-hover:text-gold transition-colors duration-300">
        {item.title}
      </h3>
      <p className="font-sans text-xs text-mist leading-relaxed mb-5">{item.description}</p>
      {item.fileUrl ? (
        <a
          href={item.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-xs text-gold tracking-widest uppercase hover:text-gold-light transition-colors"
        >
          Open Document →
        </a>
      ) : (
        <span className="font-sans text-xs text-mist/30 tracking-widest uppercase">No link yet</span>
      )}
    </div>
  );
}

export default function VaultClient() {
  const [input, setInput]     = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError]     = useState(false);
  const [filter, setFilter]   = useState<VaultItem["category"] | "All">("All");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === VAULT_PASSWORD) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setInput("");
    }
  }

  const categories = ["All", ...Array.from(new Set(VAULT_ITEMS.map((i) => i.category)))];
  const visible = filter === "All" ? VAULT_ITEMS : VAULT_ITEMS.filter((i) => i.category === filter);

  // ── LOCKED ──────────────────────────────────
  if (!unlocked) {
    return (
      <section className="min-h-screen flex items-center justify-center px-6 relative">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative w-full max-w-md text-center">
          {/* Lock icon */}
          <div className="w-14 h-14 border border-gold/30 mx-auto mb-8 flex items-center justify-center">
            <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>

          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">Private Vault</p>
          <h1 className="font-display text-4xl text-cream font-light mb-2">Access Restricted</h1>
          <p className="font-sans text-sm text-mist mb-10 leading-relaxed">
            This area contains active works-in-progress, pitch decks, and strategy documents.<br />
            Authorized access only.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false); }}
              placeholder="Enter access password"
              autoComplete="current-password"
              className={`w-full bg-ink border px-5 py-4 text-sm text-cream placeholder:text-mist/40 font-sans focus:outline-none transition-colors text-center tracking-widest ${
                error ? "border-red-500/60" : "border-white/10 focus:border-gold/50"
              }`}
            />
            {error && (
              <p className="font-sans text-xs text-red-400 tracking-wide">Incorrect password. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full bg-gold text-ink py-4 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300"
            >
              Unlock Vault
            </button>
          </form>

          <p className="font-sans text-[11px] text-mist/30 mt-8">
            {/* FUTURE: Replace client-side gate with Next.js middleware + env var for production security */}
            Need access? <a href="mailto:hello@influential.llc" className="text-mist/50 hover:text-mist transition-colors">Contact us</a>
          </p>
        </div>
      </section>
    );
  }

  // ── UNLOCKED ─────────────────────────────────
  return (
    <>
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">Private Vault</p>
            <h1 className="font-display text-4xl md:text-5xl text-cream font-light">
              Active Work & <span className="italic">Strategy</span>
            </h1>
          </div>
          <button
            onClick={() => setUnlocked(false)}
            className="font-sans text-xs text-mist border border-white/10 px-4 py-2 hover:border-red-500/40 hover:text-red-400 transition-colors duration-200 tracking-widest uppercase"
          >
            Lock Vault
          </button>
        </div>
        <p className="font-sans text-sm text-mist mt-4 max-w-xl leading-relaxed">
          Current works-in-progress, pitch decks, and confidential strategy documents. Not indexed by search engines.
        </p>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as VaultItem["category"] | "All")}
              className={`font-sans text-xs tracking-widest uppercase border px-4 py-2 transition-colors duration-200 ${
                filter === cat
                  ? "border-gold text-gold"
                  : "border-white/10 text-mist hover:border-gold/30 hover:text-cream"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        {visible.length === 0 ? (
          <p className="font-sans text-sm text-mist text-center py-20">No items in this category yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((item) => <VaultItemCard key={item.id} item={item} />)}
          </div>
        )}

        {/* Add items reminder */}
        <div className="mt-12 border border-white/5 bg-ink-2/50 p-6 text-center">
          <p className="font-sans text-xs text-mist/40">
            To add vault items: edit <code className="text-gold/60">lib/vault-items.ts</code> → append to the <code className="text-gold/60">VAULT_ITEMS</code> array.
          </p>
        </div>
      </section>
    </>
  );
}
