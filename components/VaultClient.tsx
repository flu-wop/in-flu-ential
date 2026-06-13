"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
const VaultDoor = dynamic(() => import("@/components/VaultDoor"), { ssr: false });
import { VAULT_ITEMS, VAULT_PASSWORD } from "@/lib/vault-items";
import type { VaultItem } from "@/lib/vault-items";

// ─────────────────────────────────────────────
// Category config
// ─────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  "Pitch Deck":       "text-gold border-gold/40",
  "Strategy":         "text-blue-300 border-blue-300/40",
  "Work in Progress": "text-amber-300 border-amber-300/40",
  "Music":            "text-purple-300 border-purple-300/40",
  "Press Kit":        "text-emerald-300 border-emerald-300/40",
  "Other":            "text-mist border-white/20",
};

// ─────────────────────────────────────────────
// Music Player
// ─────────────────────────────────────────────
function MusicPlayer({ tracks }: { tracks: VaultItem[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const current = tracks[currentIdx];
  const hasAudio = !!current?.audioUrl;

  function fmt(s: number) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function toggle() {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  }

  function selectTrack(i: number) {
    const a = audioRef.current;
    if (a) { a.pause(); a.currentTime = 0; }
    setCurrentIdx(i);
    setPlaying(false);
    setProgress(0);
  }

  function onTimeUpdate() {
    const a = audioRef.current;
    if (!a) return;
    setProgress(a.currentTime);
    setDuration(a.duration || 0);
  }

  function onEnded() {
    if (currentIdx < tracks.length - 1) selectTrack(currentIdx + 1);
    else setPlaying(false);
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    a.currentTime = pct * duration;
  }

  // Auto-play when track changes and was already playing
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    a.load();
    // intentionally not auto-playing on track change
  }, [currentIdx, hasAudio]);

  return (
    <div className="border border-purple-300/20 bg-ink-2 mb-12 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <p className="font-sans text-[10px] text-purple-300 tracking-widest uppercase">Unreleased Music — Private</p>
        </div>
        <p className="font-sans text-[10px] text-mist/40">{tracks.length} tracks</p>
      </div>

      {/* Now playing */}
      <div className="px-6 py-6 border-b border-white/5">
        <p className="font-sans text-[10px] text-mist/40 tracking-widest uppercase mb-1">Now Playing</p>
        <p className="font-display text-2xl text-cream font-light">{current?.title ?? "—"}</p>
        <p className="font-sans text-xs text-mist/60 mt-1">{current?.description ?? ""}</p>

        {/* Progress bar */}
        <div
          className="mt-5 h-px bg-white/10 relative cursor-pointer group"
          onClick={seek}
        >
          <div
            className="absolute top-0 left-0 h-px bg-purple-400 transition-none"
            style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: duration ? `${(progress / duration) * 100}%` : "0%" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="font-sans text-[10px] text-mist/40">{fmt(progress)}</span>
          <span className="font-sans text-[10px] text-mist/40">{duration ? fmt(duration) : "--:--"}</span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 mt-4">
          {/* Prev */}
          <button onClick={() => selectTrack(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="text-mist/40 hover:text-cream transition-colors disabled:opacity-20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button onClick={toggle}
            className="w-10 h-10 border border-purple-400/50 flex items-center justify-center hover:bg-purple-400/10 transition-colors">
            {playing ? (
              <svg className="w-4 h-4 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button onClick={() => selectTrack(Math.min(tracks.length - 1, currentIdx + 1))}
            disabled={currentIdx === tracks.length - 1}
            className="text-mist/40 hover:text-cream transition-colors disabled:opacity-20">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14 4.72 3.14L8 16.14V9.86zM16 6h2v12h-2z"/>
            </svg>
          </button>

          {!hasAudio && (
            <p className="font-sans text-[10px] text-mist/30 tracking-widest uppercase ml-2">
              Audio URL not set — add in lib/vault-items.ts
            </p>
          )}
        </div>
      </div>

      {/* Track list */}
      <div className="divide-y divide-white/5">
        {tracks.map((t, i) => (
          <button key={t.id} onClick={() => selectTrack(i)}
            className={`w-full text-left flex items-center gap-4 px-6 py-3.5 transition-colors duration-200 ${
              i === currentIdx ? "bg-purple-400/5" : "hover:bg-white/3"
            }`}>
            <span className="font-sans text-[10px] text-mist/30 w-4 text-right shrink-0">
              {i === currentIdx && playing ? (
                <span className="text-purple-400">▶</span>
              ) : (
                String(i + 1).padStart(2, "0")
              )}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-sans text-xs truncate ${i === currentIdx ? "text-cream" : "text-mist"}`}>
                {t.title}
              </p>
            </div>
            <span className="font-sans text-[9px] text-mist/30 shrink-0">{t.date}</span>
          </button>
        ))}
      </div>

      {/* Hidden audio element */}
      {hasAudio && (
        <audio
          ref={audioRef}
          src={current.audioUrl}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          onLoadedMetadata={onTimeUpdate}
          preload="metadata"
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Standard Vault Item Card
// ─────────────────────────────────────────────
function VaultItemCard({ item }: { item: VaultItem }) {
  return (
    <div className="border border-white/8 bg-ink-2 p-7 hover:border-gold/30 transition-all duration-300 hover:-translate-y-0.5 group flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-3">
        <span className={`font-sans text-[10px] tracking-widest uppercase border px-3 py-1 ${CATEGORY_COLORS[item.category] ?? "text-mist border-white/20"}`}>
          {item.category}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          {item.private && (
            <span className="font-sans text-[9px] text-red-400/60 tracking-widest uppercase border border-red-400/20 px-2 py-0.5">NDA</span>
          )}
          <span className="font-sans text-[10px] text-mist/50">{item.date}</span>
        </div>
      </div>

      {item.client && (
        <p className="font-sans text-[10px] text-gold/60 tracking-widest uppercase mb-2">— {item.client}</p>
      )}

      <h3 className="font-display text-xl text-cream font-light mb-2 group-hover:text-gold transition-colors duration-300 flex-1">
        {item.title}
      </h3>
      <p className="font-sans text-xs text-mist leading-relaxed mb-5">{item.description}</p>

      {item.fileUrl && item.fileUrl !== "#" ? (
        <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
          className="font-sans text-xs text-gold tracking-widest uppercase hover:text-gold-light transition-colors mt-auto">
          Open Document →
        </a>
      ) : (
        <span className="font-sans text-xs text-mist/25 tracking-widest uppercase mt-auto">
          {item.fileUrl === "#" ? "Link pending" : "No link"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Vault Component
// ─────────────────────────────────────────────
export default function VaultClient() {
  const [input, setInput]       = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError]       = useState(false);
  const [filter, setFilter]     = useState<string>("All");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === VAULT_PASSWORD) { setUnlocked(true); setError(false); }
    else { setError(true); setInput(""); }
  }

  const musicTracks  = VAULT_ITEMS.filter(i => i.category === "Music");
  const nonMusic     = VAULT_ITEMS.filter(i => i.category !== "Music");
  const categories   = ["All", ...Array.from(new Set(nonMusic.map(i => i.category)))];
  const visible      = filter === "All" ? nonMusic : nonMusic.filter(i => i.category === filter);

  // ── LOCKED — vault door ─────────────────────
  if (!unlocked) {
    return (
      <VaultDoor
        onUnlock={() => setUnlocked(true)}
        error={error}
        onErrorClear={() => setError(false)}
      />
    );
  }

  // ── UNLOCKED ─────────────────────────────────
  return (
    <>
      <section className="pt-40 pb-12 max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div>
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">Private Vault</p>
            <h1 className="font-display text-4xl md:text-5xl text-cream font-light">
              Active Work & <span className="italic">Inner Circle</span>
            </h1>
          </div>
          <button onClick={() => setUnlocked(false)}
            className="font-sans text-xs text-mist border border-white/10 px-4 py-2 hover:border-red-500/40 hover:text-red-400 transition-colors tracking-widest uppercase">
            Lock Vault
          </button>
        </div>
        <p className="font-sans text-sm text-mist mt-4 max-w-xl leading-relaxed">
          Unreleased music, pitch decks, and confidential strategy. Not indexed by search engines.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32">

        {/* ── Music Player ─────────────────────── */}
        {musicTracks.length > 0 && <MusicPlayer tracks={musicTracks} />}

        {/* ── Filter tabs ──────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`font-sans text-xs tracking-widest uppercase border px-4 py-2 transition-colors duration-200 ${
                filter === cat ? "border-gold text-gold" : "border-white/10 text-mist hover:border-gold/30 hover:text-cream"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* ── Item grid ────────────────────────── */}
        {visible.length === 0 ? (
          <p className="font-sans text-sm text-mist text-center py-20">No items in this category yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map(item => <VaultItemCard key={item.id} item={item} />)}
          </div>
        )}

        {/* ── Add items hint ───────────────────── */}
        <div className="mt-12 border border-white/5 bg-ink-2/50 p-6 text-center">
          <p className="font-sans text-xs text-mist/40">
            Add content: edit{" "}
            <code className="text-gold/60">lib/vault-items.ts</code>
            {" "}→ append to{" "}
            <code className="text-gold/60">VAULT_ITEMS</code>.
            For music, set <code className="text-gold/60">audioUrl</code> to a direct mp3/wav link.
          </p>
        </div>
      </section>
    </>
  );
}
