"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { BOOKING } from "@/lib/booking";

function CalendlyEmbed({ url, label }: { url: string; label: string }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Calendly widget script once
    if (document.getElementById("calendly-script")) { setLoaded(true); return; }
    const s = document.createElement("script");
    s.id = "calendly-script";
    s.src = "https://assets.calendly.com/assets/external/widget.js";
    s.async = true;
    s.onload = () => setLoaded(true);
    document.head.appendChild(s);
  }, []);

  return (
    <div className="w-full">
      {/* Calendly inline embed */}
      <div
        className="calendly-inline-widget w-full rounded-none border border-white/8"
        data-url={`${url}?hide_gdpr_banner=1&background_color=0A0A0A&text_color=F5F0E8&primary_color=C9A84C`}
        style={{ minWidth: "320px", height: "700px" }}
      />
      {!loaded && (
        <div className="flex items-center justify-center h-[700px] border border-white/8">
          <p className="font-sans text-xs text-mist tracking-widest uppercase animate-pulse">Loading {label}…</p>
        </div>
      )}
    </div>
  );
}

function BookingInner() {
  const params = useSearchParams();
  const type = params.get("type"); // "free" | "paid"
  const [active, setActive] = useState<"free" | "paid">(type === "paid" ? "paid" : "free");

  const options = [
    {
      key: "free" as const,
      label: "Free 15-Min Discovery Call",
      price: "Free",
      desc: "Not sure if we're the right fit? Let's find out. 15 minutes, no pitch, no pressure — just a real conversation about where you are and where you want to go.",
      includes: [
        "Brief intro to your project or goals",
        "Honest assessment of fit",
        "Recommended next steps",
        "No commitment required",
      ],
      booking: BOOKING.free,
    },
    {
      key: "paid" as const,
      label: "$250/hr Strategy Session",
      price: "$250 / hr",
      desc: "Come ready to work. This is a focused, executive-level session: brand audit, creative direction, growth strategy, or whatever your highest-priority challenge is.",
      includes: [
        "Pre-session intake form",
        "60-minute deep-dive session",
        "Recorded recap (on request)",
        "Written follow-up action plan",
        "Priority scheduling",
      ],
      booking: BOOKING.paid,
    },
  ];

  const current = options.find((o) => o.key === active)!;

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="pt-40 pb-16 max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6 fade-up">Book a Consultation</p>
        <h1 className="font-display font-light text-5xl md:text-6xl text-cream leading-tight max-w-3xl fade-up-delay-1">
          The first step is<br /><span className="italic text-gold">the conversation.</span>
        </h1>
        <p className="font-sans text-base text-mist max-w-lg leading-relaxed mt-6 fade-up-delay-2">
          Choose the session that fits where you are. Either way, you leave with clarity.
        </p>
      </section>

      {/* ── TOGGLE ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-6">
        <div className="flex gap-3 flex-wrap">
          {options.map((o) => (
            <button
              key={o.key}
              onClick={() => setActive(o.key)}
              className={`px-6 py-3 font-sans text-xs tracking-widest uppercase transition-all duration-300 border ${
                active === o.key
                  ? "bg-gold text-ink border-gold"
                  : "border-white/15 text-mist hover:border-gold/40 hover:text-cream"
              }`}
            >
              {o.price} — {o.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-32">
        <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">

          {/* Info panel */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="border border-white/8 bg-ink-2 p-8">
              <p className="font-sans text-xs text-gold tracking-widest uppercase mb-2">{current.label}</p>
              <p className="font-display text-4xl text-cream font-light mb-5">{current.price}</p>
              <p className="font-sans text-sm text-mist leading-relaxed mb-6">{current.desc}</p>
              <div className="space-y-2.5">
                <p className="font-sans text-[10px] text-gold tracking-widest uppercase mb-3">What's included</p>
                {current.includes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="text-gold mt-0.5 text-sm shrink-0">—</span>
                    <p className="font-sans text-xs text-cream-dim leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick contact fallback */}
            <div className="border border-white/5 bg-ink-2/50 p-6">
              <p className="font-sans text-xs text-mist/60 leading-relaxed">
                Prefer to reach out directly?{" "}
                <a href="mailto:hello@influential.llc" className="text-gold hover:text-gold-light transition-colors">
                  hello@influential.llc
                </a>
              </p>
            </div>
          </div>

          {/* Calendly embed */}
          <div>
            <CalendlyEmbed url={current.booking.url} label={current.label} />
            <p className="font-sans text-[11px] text-mist/30 mt-3 text-center">
              {/* SETUP: Replace Calendly URLs in lib/booking.ts */}
              Powered by Calendly. All times shown in your local timezone.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default function BookingClient() {
  return (
    <Suspense>
      <BookingInner />
    </Suspense>
  );
}
