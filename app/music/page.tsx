import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
const TextReveal = dynamic(() => import("@/components/TextReveal"), { ssr: false });

export const metadata: Metadata = {
  title: "Music",
  description: "Recording engineering, music production, and artist development. Credits include Curren$y, NoCap, Zaytoven, and Boosie Badazz.",
};

function CreditBadge({ name }: { name: string }) {
  return (
    <span className="inline-block border border-gold/30 text-gold font-sans text-xs tracking-widest uppercase px-4 py-2 hover:bg-gold/10 transition-colors duration-200">
      {name}
    </span>
  );
}

function StoryCard({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="border-t border-white/8 pt-8 grid md:grid-cols-[80px_1fr] gap-6">
      <span className="font-display text-5xl text-gold/20 font-light leading-none">{num}</span>
      <div>
        <h3 className="font-display text-2xl text-cream font-light mb-3">{title}</h3>
        <p className="font-sans text-sm text-mist leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

function ServicePill({ label }: { label: string }) {
  return (
    <div className="bg-ink-2 border border-white/8 px-6 py-4 font-sans text-sm text-cream-dim">
      {label}
    </div>
  );
}

export default function MusicPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(circle, #C9A84C 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-ink to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6 fade-up">Music & Production</p>
          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl text-cream leading-tight max-w-4xl fade-up-delay-1">
            From the booth<br />to the <span className="italic text-gold">boardroom.</span>
          </h1>
          <p className="font-sans text-base text-mist max-w-xl leading-relaxed mt-6 mb-10 fade-up-delay-2">
            Over a decade of professional recording engineering, music production, and artist development — built on real relationships, real sessions, and real results.
          </p>

          {/* Credits */}
          <div className="flex flex-wrap gap-3 fade-up-delay-3">
            {["Curren$y", "NoCap", "Zaytoven", "Boosie Badazz", "Fee Banks", "Abby Urbina"].map((n) => (
              <CreditBadge key={n} name={n} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STORIES ──────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-16">The Journey</p>
        <div className="space-y-14">
          <StoryCard
            num="01"
            title="Breaking In — Fee Banks & Abby Urbina"
            body="It started with an internship. Working alongside industry veterans Fee Banks and Abby Urbina, the fundamentals of professional studio culture were earned — not handed. Every session was a masterclass in how the music business actually operates: relationships, preparation, and the discipline to stay ready when the room opens up."
          />
          <StoryCard
            num="02"
            title="SXSW — Going Viral with Boosie Badazz"
            body="Austin. SXSW. A moment that doesn't happen twice. The performance alongside Boosie Badazz broke through the noise of the biggest music festival in the country — clips spreading organically and proving that credibility isn't bought, it's built in rooms most people never reach. That moment crystallized what it means to execute at the highest level of hip-hop culture."
          />
          <StoryCard
            num="03"
            title="Shadowing Zaytoven — Atlanta & Los Angeles"
            body="To study under one of hip-hop's most iconic producers — the architect of the Gucci Mane sound, the man behind Future's early career — is to understand that greatness lives in the details. Shadowing Zaytoven across sessions in Atlanta and Los Angeles was a graduate education in sonic branding, workflow mastery, and how a producer's identity becomes inseparable from the artists they touch."
          />
          <StoryCard
            num="04"
            title="Curren$y — In-House Producer & Engineer"
            body="The full-circle moment. Becoming Curren$y's in-house producer and recording engineer meant being the first and last person to hear every idea — responsible for translating an artist's vision into a finished record. Sessions weren't just about tracks; they were about protecting a sound, maintaining a legacy, and delivering consistently at the level Jet Life demands."
          />
          <StoryCard
            num="05"
            title="NoCap — Engineering Excellence"
            body="Working with NoCap meant operating in the emotional depth of Southern rap at its most vulnerable and raw. Engineering sessions for one of the genre's most critically praised voices required technical precision, emotional intelligence, and the trust of an artist who guards his process closely. The sessions speak for themselves."
          />
        </div>
      </section>

      <div className="divider-gold max-w-7xl mx-auto px-6 md:px-10" />

      {/* ── SERVICES ─────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Music Services</p>
            <h2 className="font-display text-4xl text-cream font-light leading-tight mb-6">
              What we offer <span className="italic">in the studio.</span>
            </h2>
            <p className="font-sans text-sm text-mist leading-relaxed mb-8">
              Whether you're a recording artist, a brand seeking music supervision, or a label looking for a trusted production partner — we bring professional-grade execution and cultural credibility to every project.
            </p>
            <Link
              href="/#booking"
              className="inline-block border border-gold/50 text-gold px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-ink transition-all duration-300"
            >
              Book a Music Consultation
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {[
              "Recording Engineering",
              "Music Production",
              "Artist Development & Coaching",
              "Studio Session Direction",
              "Music Supervision (Film & Brand)",
              "Mixing Consultation",
              "Creative Direction for Releases",
              "Label & Label Services Liaison",
            ].map((s) => (
              <ServicePill key={s} label={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="py-20 bg-ink-2 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Ready to Work?</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-8">
            Let's make something <span className="italic">worth hearing.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#booking"
              className="inline-block bg-gold text-ink px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300"
            >
              Free Discovery Call
            </Link>
            <Link
              href="/business"
              className="inline-block border border-white/20 text-cream-dim px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:border-gold/40 hover:text-cream transition-all duration-300"
            >
              View Business Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
