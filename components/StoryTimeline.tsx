"use client";
import { useEffect, useRef } from "react";

const CHAPTERS = [
  {
    year: "Origin",
    location: "Ghana → Toronto → Chicago",
    headline: "A story built\nacross three continents.",
    body: "Born to Ghanaian parents. Raised between Toronto, Chicago, and New Orleans. That multicultural foundation became the lens through which everything else is understood — music, business, culture, and the spaces where they overlap.",
    accent: "#C9A84C",
    glyph: "◈",
  },
  {
    year: "2008",
    location: "New Orleans, LA",
    headline: "The industry\nopens its doors.",
    body: "Internships with Fee Banks and Abby Urbina. First professional music industry exposure — learning the craft and the culture simultaneously. Every session a masterclass in how the business actually operates.",
    accent: "#A89880",
    glyph: "◉",
  },
  {
    year: "2012",
    location: "Austin, TX — SXSW",
    headline: "The moment\neveryone sees.",
    body: "A viral performance alongside Boosie Badazz at SXSW. Clips spreading organically across the internet. Proof that credibility isn't bought — it's built in rooms most people never reach.",
    accent: "#C9A84C",
    glyph: "◎",
  },
  {
    year: "2014",
    location: "Atlanta & Los Angeles",
    headline: "A graduate education\nin sonic branding.",
    body: "Shadowing Zaytoven — architect of the Gucci Mane sound, the man behind Future's early career — across sessions in Atlanta and Los Angeles. Greatness lives in the details.",
    accent: "#8B9E7A",
    glyph: "◈",
  },
  {
    year: "2016",
    location: "New Orleans, LA — Jet Life",
    headline: "In-house.\nTrusted completely.",
    body: "Becoming Curren$y's in-house producer and recording engineer. The first and last person to hear every idea. Responsible for translating an artist's vision into a finished record — protecting a sound, maintaining a legacy.",
    accent: "#C9A84C",
    glyph: "◉",
  },
  {
    year: "2017",
    location: "Industrial — Multi-State",
    headline: "The discipline\nmost creatives lack.",
    body: "Rising from field operator to project manager on multi-million dollar demolition projects. Systems thinking, stakeholder management, deadline execution — the kind of pressure-tested leadership that creative studios rarely possess.",
    accent: "#7BA3C4",
    glyph: "◎",
  },
  {
    year: "2019",
    location: "New Orleans, LA — NFL",
    headline: "High stakes.\nHigh scrutiny.",
    body: "Brand and identity work for former New Orleans Saints players transitioning out of professional sports. Athletes rebuilding public identity. Speaking engagements, sponsorships, media coverage — all on the line.",
    accent: "#A89880",
    glyph: "◈",
  },
  {
    year: "2023",
    location: "New Orleans, LA",
    headline: "Engineering\nexcellence.",
    body: "Recording engineering credits for NoCap — one of Southern rap's most critically acclaimed voices. Technical precision, emotional intelligence, and the trust of an artist who guards his process closely.",
    accent: "#C9A84C",
    glyph: "◉",
  },
  {
    year: "Now",
    location: "New Orleans, LA — Global",
    headline: "IN-FLU-ENTIAL LLC.\nOpen for business.",
    body: "Full-service creative direction and brand strategy. Alongside Donny Markowitz. Serving artists, founders, and premium brands who demand more than aesthetics — they demand results.",
    accent: "#C9A84C",
    glyph: "◎",
  },
];

export default function StoryTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: import("gsap").Context;
    let cleanup: (() => void) | undefined;

    async function init() {
      const { gsap }         = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current;
      const sticky    = stickyRef.current;
      if (!container || !sticky) return;

      const panels    = sticky.querySelectorAll<HTMLElement>(".chapter-panel");
      const total     = panels.length;

      ctx = gsap.context(() => {

        // ── Pin the sticky area for the full scroll distance ──
        ScrollTrigger.create({
          trigger:  container,
          start:    "top top",
          end:      `+=${total * 100}vh`,
          pin:      sticky,
          pinSpacing: false,
          anticipatePin: 1,
        });

        // ── Animate each chapter in/out ────────────────────
        panels.forEach((panel, i) => {
          const isLast = i === total - 1;

          // Elements inside the panel
          const year     = panel.querySelector(".ch-year");
          const loc      = panel.querySelector(".ch-loc");
          const headline = panel.querySelector(".ch-headline");
          const body     = panel.querySelector(".ch-body");
          const line     = panel.querySelector(".ch-line");
          const glyph    = panel.querySelector(".ch-glyph");
          const progress = panel.querySelector(".ch-progress");

          // Set initial state
          gsap.set(panel, { autoAlpha: i === 0 ? 1 : 0, position: "absolute", inset: 0 });
          gsap.set([year, loc, glyph], { y: 30, autoAlpha: 0 });
          gsap.set(headline, { y: 50, autoAlpha: 0 });
          gsap.set(body, { y: 20, autoAlpha: 0 });
          gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger:    container,
              start:      `top+=${i * 100}vh top`,
              end:        `top+=${(i + 1) * 100}vh top`,
              scrub:      0.8,
              onEnter:    () => {
                gsap.set(panel, { autoAlpha: 1, zIndex: i + 1 });
              },
              onLeaveBack: () => {
                if (i > 0) gsap.set(panel, { autoAlpha: 0, zIndex: i });
              },
            },
          });

          // Animate in (first 60% of scroll for this chapter)
          tl
            .to(panel, { autoAlpha: 1, duration: 0.1 }, 0)
            .to(glyph,    { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.05)
            .to(year,     { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.1)
            .to(loc,      { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.15)
            .to(line,     { scaleX: 1, duration: 0.4, ease: "power2.inOut" }, 0.2)
            .to(headline, { y: 0, autoAlpha: 1, duration: 0.4, ease: "power2.out" }, 0.25)
            .to(body,     { y: 0, autoAlpha: 1, duration: 0.35, ease: "power2.out" }, 0.35)
            .to(progress, { width: "100%", duration: 0.6, ease: "none" }, 0)

          // Animate out (last 30% — fade up and out, unless last chapter)
          if (!isLast) {
            tl
              .to(headline, { y: -40, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 0.72)
              .to(body,     { y: -20, autoAlpha: 0, duration: 0.2,  ease: "power2.in" }, 0.75)
              .to([year, loc, glyph], { y: -20, autoAlpha: 0, duration: 0.2 }, 0.78)
              .to(line,     { scaleX: 0, transformOrigin: "right center", duration: 0.2 }, 0.8)
              .to(panel,    { autoAlpha: 0, duration: 0.1 }, 0.9)
          }
        });

        // ── Progress dots ──────────────────────────────
        const dots = sticky.querySelectorAll<HTMLElement>(".nav-dot");
        dots.forEach((dot, i) => {
          ScrollTrigger.create({
            trigger: container,
            start:   `top+=${i * 100}vh top`,
            end:     `top+=${(i + 1) * 100}vh top`,
            onEnter:     () => dots.forEach((d, j) => d.classList.toggle("dot-active", j === i)),
            onEnterBack: () => dots.forEach((d, j) => d.classList.toggle("dot-active", j === i)),
          });
        });

      }, container);

      cleanup = () => ctx?.revert();
    }

    init();
    return () => cleanup?.();
  }, []);

  return (
    // Outer scroll container — height = chapters * 100vh
    <div
      ref={containerRef}
      style={{ height: `${CHAPTERS.length * 100}vh` }}
      className="relative"
    >
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="relative w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* ── Background atmosphere ───────────────── */}
        <div className="absolute inset-0 bg-[#060606]" />

        {/* Vertical scan line */}
        <div className="absolute left-[45%] md:left-[38%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/10 to-transparent pointer-events-none" />

        {/* Corner glyphs */}
        <div className="absolute top-8 left-8 font-sans text-[9px] text-gold/20 tracking-widest">IN-FLU-ENTIAL</div>
        <div className="absolute top-8 right-8 font-sans text-[9px] text-mist/20 tracking-widest">VISUAL JOURNEY</div>
        <div className="absolute bottom-8 left-8 font-sans text-[9px] text-mist/20">© {new Date().getFullYear()}</div>

        {/* ── Chapter panels (stacked, one per chapter) ── */}
        {CHAPTERS.map((ch, i) => (
          <div key={i} className="chapter-panel absolute inset-0 flex items-center">

            {/* Left column — year + glyph */}
            <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 text-left">
              <div className="ch-glyph font-display text-4xl mb-4" style={{ color: ch.accent, opacity: 0.6 }}>
                {ch.glyph}
              </div>
              <div className="ch-year font-display text-6xl md:text-8xl font-light leading-none"
                style={{ color: ch.accent, opacity: 0.15, letterSpacing: "-0.02em" }}>
                {ch.year}
              </div>
            </div>

            {/* Main content — centered */}
            <div className="relative max-w-3xl mx-auto px-6 md:px-20 w-full">

              {/* Location */}
              <div className="ch-loc flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: ch.accent }} />
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: ch.accent }}>
                  {ch.location}
                </span>
              </div>

              {/* Horizontal rule */}
              <div className="ch-line h-px mb-8 w-full" style={{ background: ch.accent, opacity: 0.3 }} />

              {/* Headline */}
              <h2 className="ch-headline font-display text-4xl sm:text-5xl md:text-6xl text-cream font-light leading-tight mb-8 whitespace-pre-line">
                {ch.headline}
              </h2>

              {/* Body */}
              <p className="ch-body font-sans text-sm md:text-base text-mist leading-relaxed max-w-lg">
                {ch.body}
              </p>

              {/* Chapter progress bar */}
              <div className="mt-10 h-px bg-white/5 overflow-hidden w-full max-w-sm">
                <div className="ch-progress h-full w-0" style={{ background: ch.accent }} />
              </div>
            </div>

            {/* Chapter number — right edge */}
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2">
              <span className="font-display text-[80px] md:text-[120px] font-light leading-none select-none"
                style={{ color: ch.accent, opacity: 0.04 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}

        {/* ── Side nav dots ──────────────────────────── */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
          {CHAPTERS.map((_, i) => (
            <div
              key={i}
              className="nav-dot w-1 h-1 rounded-full bg-white/15 transition-all duration-400"
              style={{ "--dot-accent": CHAPTERS[i].accent } as React.CSSProperties}
            />
          ))}
        </div>

        {/* ── Scroll hint (only first chapter) ─────── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="font-sans text-[9px] tracking-widest uppercase text-mist">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-mist to-transparent" />
        </div>
      </div>

      <style>{`
        .dot-active {
          background: var(--dot-accent) !important;
          transform: scale(2);
        }
      `}</style>
    </div>
  );
}
