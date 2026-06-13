"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Project {
  id: string;
  category: string;
  title: string;
  desc: string;
  tags: string[];
  url?: string;
  accent: string;
  pattern: string;
  live?: boolean;
  pending?: boolean;
}

const PROJECTS: Project[] = [
  { id:"mid-city-sound",   category:"Website",    title:"Mid City Sound Studios",           desc:"Premium recording studio — booking, Stripe deposits, merch, engineer pages.",     tags:["Next.js","Booking","Brand"],     url:"https://midcitysound.com",              accent:"#C9A84C", pattern:"repeating-linear-gradient(45deg,#C9A84C11 0,#C9A84C11 1px,transparent 1px,transparent 12px)",  live:true },
  { id:"epoch-skin",       category:"Website",    title:"Epoch Skin",                        desc:"Luxury waxing & organic skincare — e-commerce, booking, three-part logo system.", tags:["Next.js","E-Commerce","Brand"],  url:"https://epoch-skin.com",                accent:"#8B9E7A", pattern:"repeating-linear-gradient(135deg,#8B9E7A11 0,#8B9E7A11 1px,transparent 1px,transparent 14px)", live:true },
  { id:"donald-markowitz", category:"Website",    title:"Donald Markowitz",                  desc:"Academy Award-winner's press & legacy site — timeline, credits, discography.",     tags:["Next.js","Editorial","Portfolio"],url:"https://donaldmarkowitz.com",           accent:"#A89880", pattern:"repeating-linear-gradient(0deg,#A8988011 0,#A8988011 1px,transparent 1px,transparent 16px)",   live:true },
  { id:"jade-the-gem",     category:"Website",    title:"Jade the Gem",                      desc:"DJ booking & merch — R3F 3D gem hero, Stripe checkout, Printful integration.",    tags:["Next.js","Three.js","Merch"],    url:"https://jade-the-gem-dj.vercel.app",    accent:"#7BA3C4", pattern:"repeating-linear-gradient(60deg,#7BA3C411 0,#7BA3C411 1px,transparent 1px,transparent 10px)",  live:true },
  { id:"fluhaul",          category:"Website",    title:"Flu-Haul",                          desc:"Cinematic junk removal site — GSAP parallax, Lenis scroll, full booking flow.",    tags:["Next.js","GSAP","Lenis"],        url:"https://fluhaul.com",                   accent:"#C4874A", pattern:"repeating-linear-gradient(90deg,#C4874A11 0,#C4874A11 1px,transparent 1px,transparent 18px)",  live:true },
  { id:"streetbeat",       category:"Documentary",title:"Streetbeat Documentary",            desc:"Full digital ecosystem — marketing site, streaming paywall, campaign.",            tags:["Next.js","Streaming","Campaign"],url:"https://streetbeat.video",              accent:"#4AC4A8", pattern:"repeating-linear-gradient(45deg,#4AC4A811 0,#4AC4A811 1px,transparent 1px,transparent 12px)",  live:true },
  { id:"lil-squiggle",     category:"Campaign",   title:"Lil Squiggle",                      desc:"Reggae-dub chibi brand — merch store, multi-platform social strategy.",            tags:["Campaign","Merch","Social"],     url:"https://lilsquiggle.vercel.app",        accent:"#C4C44A", pattern:"repeating-linear-gradient(135deg,#C4C44A11 0,#C4C44A11 1px,transparent 1px,transparent 10px)", live:true },
  { id:"egoff",            category:"Website",    title:"EGOFF Essentials",                   desc:"Luxury natural soap brand — single-page editorial site with Tailwind CDN.",         tags:["HTML","Tailwind","Brand"],       url:"https://egoff.vercel.app",              accent:"#C4A47A", pattern:"repeating-linear-gradient(60deg,#C4A47A11 0,#C4A47A11 1px,transparent 1px,transparent 14px)", live:true },
  { id:"streetbeats",      category:"Platform",   title:"Streetbeats Platform",               desc:"Beat marketplace — interactive cards, waveform viz, NOLA green accent, email capture.", tags:["Next.js","Marketplace","Music"], url:"https://streetbeats.video",             accent:"#4AAA6A", pattern:"repeating-linear-gradient(90deg,#4AAA6A11 0,#4AAA6A11 1px,transparent 1px,transparent 16px)", live:true },
  { id:"prof-longhair",    category:"Pitch Deck", title:"Prof. Longhair Documentary",        desc:"Investor pitch for Fish Pot Studios — narrative, market positioning, funding.",    tags:["Pitch Deck","Film","Investor"],                                               accent:"#9A7AC4", pattern:"repeating-linear-gradient(0deg,#9A7AC411 0,#9A7AC411 1px,transparent 1px,transparent 14px)" },
  { id:"graham-hill",      category:"Website",    title:"Graham Hill",                       desc:"Debut LP campaign for the Beach House drummer — press, streaming, artist identity.",tags:["Next.js","Music","Campaign"],                                                accent:"#C4A47A", pattern:"repeating-linear-gradient(60deg,#C4A47A11 0,#C4A47A11 1px,transparent 1px,transparent 12px)", pending:true },
];

export default function DragPortfolio() {
  const trackRef   = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX     = useRef(0);
  const scrollLeft = useRef(0);
  const velX       = useRef(0);
  const lastX      = useRef(0);
  const rafId      = useRef<number>(0);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      startX.current    = x - track.offsetLeft;
      scrollLeft.current = track.scrollLeft;
      lastX.current     = x;
      velX.current      = 0;
      cancelAnimationFrame(rafId.current);
      track.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x    = "touches" in e ? e.touches[0].clientX : e.clientX;
      const walk = (x - startX.current - track.offsetLeft);
      velX.current = x - lastX.current;
      lastX.current = x;
      track.scrollLeft = scrollLeft.current - walk;
    };

    const onUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      track.style.cursor = "grab";
      // Momentum
      const momentum = () => {
        velX.current *= 0.92;
        track.scrollLeft -= velX.current;
        if (Math.abs(velX.current) > 0.5) rafId.current = requestAnimationFrame(momentum);
      };
      momentum();
    };

    track.addEventListener("mousedown",  onDown as EventListener);
    track.addEventListener("mousemove",  onMove as EventListener);
    track.addEventListener("mouseup",    onUp);
    track.addEventListener("mouseleave", onUp);
    track.addEventListener("touchstart", onDown as EventListener, { passive: false });
    track.addEventListener("touchmove",  onMove as EventListener, { passive: false });
    track.addEventListener("touchend",   onUp);

    return () => {
      track.removeEventListener("mousedown",  onDown as EventListener);
      track.removeEventListener("mousemove",  onMove as EventListener);
      track.removeEventListener("mouseup",    onUp);
      track.removeEventListener("mouseleave", onUp);
      track.removeEventListener("touchstart", onDown as EventListener);
      track.removeEventListener("touchmove",  onMove as EventListener);
      track.removeEventListener("touchend",   onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div className="relative">
      {/* Drag hint */}
      <p className="font-sans text-[10px] text-mist/40 tracking-widest uppercase mb-6 px-6 md:px-10">
        ← Drag to explore →
      </p>

      {/* Track */}
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-scroll pb-8 px-6 md:px-10"
        style={{ cursor:"grab", scrollbarWidth:"none", msOverflowStyle:"none", userSelect:"none" }}
      >
        {PROJECTS.map((p) => (
          <div
            key={p.id}
            className="shrink-0 relative flex flex-col border border-white/8 bg-ink-2 overflow-hidden group transition-all duration-500"
            style={{ width: "min(72vw, 420px)", height: 520 }}
            onMouseEnter={() => setActive(p.id)}
            onMouseLeave={() => setActive(null)}
          >
            {/* Visual area */}
            <div
              className="flex-1 relative overflow-hidden"
              style={{ background:"#111", backgroundImage: p.pattern }}
            >
              {/* Accent glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background:`radial-gradient(circle at 30% 40%, ${p.accent}22 0%, transparent 60%)` }}
              />
              {/* Category */}
              <div className="absolute top-5 left-5">
                <span className="font-sans text-[9px] tracking-widest uppercase px-3 py-1 border"
                  style={{ color: p.accent, borderColor: `${p.accent}40` }}>
                  {p.category}
                </span>
              </div>
              {/* Live indicator */}
              {p.live && (
                <div className="absolute top-5 right-5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-sans text-[9px] text-mist/50 tracking-widest uppercase">Live</span>
                </div>
              )}
              {p.pending && (
                <div className="absolute top-5 right-5">
                  <span className="font-sans text-[9px] tracking-widest uppercase" style={{ color:`${p.accent}80` }}>In Progress</span>
                </div>
              )}
              {/* Title watermark */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ink-2 to-transparent">
                <p className="font-display text-3xl text-cream/10 font-light leading-tight group-hover:text-cream/20 transition-colors duration-500">
                  {p.title}
                </p>
              </div>
            </div>

            {/* Info panel */}
            <div className="p-6 border-t border-white/8 bg-ink-2">
              <h3 className="font-display text-xl text-cream font-light mb-2 group-hover:text-gold transition-colors duration-300">
                {p.title}
              </h3>
              <p className="font-sans text-xs text-mist leading-relaxed mb-4 line-clamp-2">{p.desc}</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0,2).map(t => (
                    <span key={t} className="font-sans text-[9px] text-mist/50 border border-white/8 px-2 py-0.5">{t}</span>
                  ))}
                </div>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    data-cursor="View →"
                    className="font-sans text-[10px] text-gold tracking-widest uppercase hover:text-gold-light transition-colors"
                    onClick={e => e.stopPropagation()}>
                    View →
                  </a>
                ) : (
                  <span className="font-sans text-[10px] text-mist/30 tracking-widest uppercase">
                    {p.pending ? "Soon" : "NDA"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hide scrollbar */}
      <style>{`div::-webkit-scrollbar{display:none}`}</style>
    </div>
  );
}
