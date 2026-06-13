import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products | IN-FLU-ENTIAL LLC",
  description: "Website Starter Kits for creatives and artists. DIY guide + template or done-with-you buildout.",
};

// ─────────────────────────────────────────────
// What's included per tier
// ─────────────────────────────────────────────
const DIY_INCLUDES = [
  "Industry-specific PDF setup guide (step-by-step, plain English)",
  "Starter Next.js template repo — clone, fill in your info, push",
  "Pre-wired booking form with Stripe deposit flow",
  "Turso DB + Resend email confirmations included",
  "Setup checklist PDF — from zero to live in a weekend",
  "Lifetime access to future guide updates",
];

const DWY_INCLUDES = [
  "Everything in the DIY Kit",
  "90-minute screen share — we get you from zero to live, together",
  "Domain setup + Vercel deployment handled",
  "Your content added (services, prices, about copy)",
  "30 days async Q&A via DM after launch",
  "Priority scheduling — sessions book within the week",
];

const NICHES = [
  { icon: "✦", label: "Estheticians & Waxing Studios" },
  { icon: "✦", label: "Hair Stylists & Barbers" },
  { icon: "✦", label: "DJs & Music Artists" },
  { icon: "✦", label: "Photographers & Videographers" },
  { icon: "✦", label: "Personal Trainers & Coaches" },
  { icon: "✦", label: "Visual Artists & Designers" },
];

// Vignette — mini booking confirmation card
function BookingVignette() {
  return (
    <div className="border border-white/10 bg-ink-3 p-5 font-sans text-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/8">
        <span className="text-gold tracking-widest uppercase text-[10px]">Booking Confirmed</span>
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      </div>
      <div className="space-y-2.5 text-mist">
        <div className="flex justify-between">
          <span className="text-mist/60">Service</span>
          <span className="text-cream">Brazilian Wax</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mist/60">Date</span>
          <span className="text-cream">Sat · 2:30 PM</span>
        </div>
        <div className="flex justify-between">
          <span className="text-mist/60">Deposit</span>
          <span className="text-gold">$25 paid</span>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-white/8 text-[10px] text-mist/40">
        Confirmation sent to client · ics calendar invite attached
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/4 blur-[100px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6 fade-up">Digital Products</p>
          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl text-cream leading-tight max-w-4xl fade-up-delay-1">
            Your first website,<br />
            <span className="italic text-gold">done right.</span>
          </h1>
          <p className="font-sans text-base text-mist max-w-xl leading-relaxed mt-6 fade-up-delay-2">
            Real booking systems. Real Stripe payments. Real email confirmations.
            Not a drag-and-drop template — an actual production-grade site built the way our clients&apos; sites are built.
          </p>
        </div>
      </section>

      {/* ── WHO IT'S FOR ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6">Built for</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {NICHES.map((n) => (
            <div key={n.label} className="border border-white/8 bg-ink-2 px-5 py-4 flex items-center gap-3">
              <span className="text-gold/40 text-xs">{n.icon}</span>
              <span className="font-sans text-xs text-mist">{n.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT YOU GET VIGNETTE ────────────────── */}
      <section className="py-16 bg-ink-2 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">What you&apos;re building</p>
              <h2 className="font-display text-4xl text-cream font-light leading-tight mb-6">
                Clients book while you <span className="italic">sleep.</span>
              </h2>
              <p className="font-sans text-sm text-mist leading-relaxed mb-6">
                Every site includes a real booking flow — clients pick a service, choose a time, and pay a deposit directly.
                You get an email. They get an email with a calendar invite. No middleman. No monthly booking app fees.
              </p>
              <p className="font-sans text-xs text-mist/50">
                Built on the same stack as{" "}
                <a href="https://epoch-skin.com" target="_blank" rel="noopener noreferrer" className="text-gold/70 hover:text-gold transition-colors">
                  Epoch Skin
                </a>{" "}
                and{" "}
                <a href="https://midcitysound.com" target="_blank" rel="noopener noreferrer" className="text-gold/70 hover:text-gold transition-colors">
                  Mid City Sound
                </a>
                .
              </p>
            </div>
            <div className="max-w-xs">
              <BookingVignette />
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING CARDS ────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Choose your path</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-16 max-w-xl leading-tight">
          Two ways to <span className="italic">get launched.</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          {/* ── DIY KIT ── */}
          <div className="border border-white/10 bg-ink-2 p-10 flex flex-col">
            <p className="font-sans text-[10px] text-mist/60 tracking-widest uppercase mb-2">Tier 1</p>
            <h3 className="font-display text-3xl text-cream font-light mb-1">DIY Starter Kit</h3>
            <p className="font-display text-5xl text-gold font-light mt-4 mb-2">$47</p>
            <p className="font-sans text-xs text-mist/60 mb-8">One-time · Instant access</p>
            <div className="space-y-3 mb-10 flex-1">
              {DIY_INCLUDES.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-gold mt-0.5 shrink-0">—</span>
                  <p className="font-sans text-xs text-cream-dim leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            {/* Replace href with your Stripe payment link */}
            <a
              href="/booking?type=free"
              className="block text-center border border-gold/50 text-gold px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-ink transition-all duration-300"
            >
              Get the Kit — $47
            </a>
            <p className="font-sans text-[11px] text-mist/40 mt-3 text-center">
              Instant download after purchase
            </p>
          </div>

          {/* ── DONE WITH YOU ── */}
          <div className="border border-gold/30 bg-ink-2 p-10 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <p className="font-sans text-[10px] text-gold tracking-widest uppercase">Tier 2</p>
              <span className="font-sans text-[10px] text-ink bg-gold px-3 py-1 tracking-widest uppercase">
                Most Popular
              </span>
            </div>
            <h3 className="font-display text-3xl text-cream font-light mb-1">Done-With-You</h3>
            <p className="font-display text-5xl text-gold font-light mt-4 mb-2">$297</p>
            <p className="font-sans text-xs text-mist/60 mb-8">One-time · Includes everything in Tier 1</p>
            <div className="space-y-3 mb-10 flex-1">
              {DWY_INCLUDES.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="text-gold mt-0.5 shrink-0">—</span>
                  <p className="font-sans text-xs text-cream-dim leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
            <Link
              href="/booking?type=free"
              className="block text-center bg-gold text-ink px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300"
            >
              Book a Session — $297
            </Link>
            <p className="font-sans text-[11px] text-mist/40 mt-3 text-center">
              Schedule a call first · no payment until we&apos;re aligned
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────── */}
      <section className="py-20 bg-ink-2 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-10">Common Questions</p>
          {[
            {
              q: "Do I need to know how to code?",
              a: "For the DIY Kit: basic comfort with a terminal and following instructions. The guide is written for first-timers. For Done-With-You: nothing — we handle all of it on the call.",
            },
            {
              q: "Can I build this from my iPhone?",
              a: "The first setup requires a Mac or PC for about 2–3 hours. After launch, you can make content edits directly from your phone via GitHub's mobile editor — and they deploy automatically.",
            },
            {
              q: "What's the difference between this and Squarespace or Wix?",
              a: "You own the code, you own the data, and you pay nothing monthly beyond your domain (~$12/yr) and hosting (free on Vercel). The booking system charges clients directly to your Stripe — no platform taking a cut.",
            },
            {
              q: "Can I change the colors and branding?",
              a: "Yes — the template is designed to be reskinned. The guide walks you through swapping your palette, fonts, and logo in one config file.",
            },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-white/8 py-7 last:border-b-0">
              <p className="font-display text-lg text-cream mb-3">{q}</p>
              <p className="font-sans text-sm text-mist leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-24 max-w-3xl mx-auto px-6 text-center">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Not sure which fits?</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-8">
          Let&apos;s talk it through — <span className="italic">free.</span>
        </h2>
        <Link
          href="/booking?type=free"
          className="inline-block bg-gold text-ink px-10 py-4 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300"
        >
          Book a Free 15-Min Call
        </Link>
        <p className="font-sans text-xs text-mist/40 mt-4">No pitch. Just a real conversation.</p>
      </section>
    </>
  );
}
