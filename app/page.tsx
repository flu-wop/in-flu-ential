import type { Metadata } from "next";
import dynamic from "next/dynamic";
const HeroCanvas = dynamic(() => import("@/components/HeroCanvas"), { ssr: false });
import Link from "next/link";

export const metadata: Metadata = {
  title: "IN-FLU-ENTIAL LLC | Creative Direction, Branding & Strategy",
};

// ── Reusable CTA button ─────────────────────────────
function CtaLink({ href, children, variant = "outline" }: { href: string; children: React.ReactNode; variant?: "gold" | "outline" }) {
  const base = "inline-block px-8 py-3.5 text-xs tracking-widest uppercase font-sans transition-all duration-300";
  const styles = variant === "gold"
    ? `${base} bg-gold text-ink hover:bg-gold-light`
    : `${base} border border-gold/50 text-gold hover:bg-gold hover:text-ink`;
  return <Link href={href} className={styles}>{children}</Link>;
}

// ── Stat block ──────────────────────────────────────
function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center md:text-left">
      <p className="font-display text-4xl md:text-5xl text-gold font-light">{number}</p>
      <p className="font-sans text-xs text-mist tracking-widest uppercase mt-1">{label}</p>
    </div>
  );
}

// ── Service card ─────────────────────────────────────
function ServiceCard({ title, desc, href }: { title: string; desc: string; href: string }) {
  return (
    <Link
      href={href}
      className="group block border border-white/8 bg-ink-2 p-8 hover:border-gold/40 transition-all duration-400 hover:-translate-y-1"
    >
      <p className="font-display text-xl text-cream mb-3 group-hover:text-gold transition-colors duration-300">{title}</p>
      <p className="font-sans text-sm text-mist leading-relaxed">{desc}</p>
      <p className="mt-5 text-xs text-gold tracking-widest uppercase font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Explore →
      </p>
    </Link>
  );
}

// ── Testimonial ──────────────────────────────────────
function Testimonial({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <div className="border-l-2 border-gold/40 pl-6 py-2">
      <p className="font-display text-lg text-cream italic leading-relaxed mb-4">"{quote}"</p>
      <p className="font-sans text-xs text-mist tracking-widest uppercase">{name}</p>
      <p className="font-sans text-xs text-gold-dim mt-0.5">{title}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        {/* Three.js particle canvas */}
        <HeroCanvas />
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#C9A84C 1px, transparent 1px), linear-gradient(90deg, #C9A84C 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-24">
          {/* Eyebrow */}
          <p className="fade-up font-sans text-xs text-gold tracking-widest3 uppercase mb-8">
            Creative Direction · Branding · Strategy
          </p>

          {/* Main headline */}
          <h1 className="fade-up-delay-1 font-display font-light text-5xl sm:text-6xl md:text-7xl xl:text-8xl text-cream leading-[1.05] max-w-5xl">
            Global Roots.<br />
            <span className="italic text-gold">Executive</span> Vision.<br />
            Creative Execution.
          </h1>

          {/* Sub */}
          <p className="fade-up-delay-2 font-sans text-base md:text-lg text-mist max-w-xl leading-relaxed mt-8 mb-10">
            We build brands that move — across music, business, and culture. Strategy with soul. Execution without compromise.
          </p>

          {/* CTAs */}
          <div className="fade-up-delay-3 flex flex-col sm:flex-row gap-4">
            <CtaLink href="/#booking" variant="gold">Book Free Discovery Call</CtaLink>
            <CtaLink href="/business">Our Services</CtaLink>
          </div>

          {/* Stats */}
          <div className="mt-20 pt-12 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-10">
            <Stat number="15+" label="Years in Music" />
            <Stat number="50+" label="Artists Developed" />
            <Stat number="3" label="Continents of Influence" />
            <Stat number="$5k–$25k+" label="Branding Packages" />
          </div>
        </div>
      </section>

      {/* ── INTRO ────────────────────────────────────── */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-5">Who We Are</p>
            <h2 className="font-display text-4xl md:text-5xl text-cream font-light leading-tight mb-6">
              Where the <span className="italic">boardroom</span> meets the booth.
            </h2>
            <p className="font-sans text-sm text-mist leading-relaxed mb-4">
              IN-FLU-ENTIAL LLC is the creative studio of a rare operator — one who has sat in the studio with Grammy-connected producers, stood on SXSW stages, managed million-dollar demolition projects, and built digital brands from scratch.
            </p>
            <p className="font-sans text-sm text-mist leading-relaxed mb-8">
              Born to Ghanaian parents. Raised between Toronto, Chicago, and New Orleans. That breadth isn't background — it's our competitive advantage.
            </p>
            <CtaLink href="/business">Read the Full Story</CtaLink>
          </div>
          <div className="space-y-6">
            {[
              { n: "01", t: "Music Industry Credibility", d: "In-house producer/engineer for Curren$y. Studio work with Zaytoven, NoCap, Boosie Badazz." },
              { n: "02", t: "Executive Execution", d: "Rose from field operator to project manager in industrial demolition — same rigor applied to brand builds." },
              { n: "03", t: "Global Creative Range", d: "Ghana → Toronto → Chicago → New Orleans. Multi-cultural fluency that makes brands travel." },
            ].map(({ n, t, d }) => (
              <div key={n} className="flex gap-5 items-start">
                <span className="font-display text-gold/40 text-2xl font-light shrink-0 mt-0.5">{n}</span>
                <div>
                  <p className="font-sans text-sm text-cream font-medium mb-1">{t}</p>
                  <p className="font-sans text-xs text-mist leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-gold max-w-7xl mx-auto px-6 md:px-10" />

      {/* ── SERVICES ─────────────────────────────────── */}
      <section className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">What We Do</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-12 max-w-xl leading-tight">
          Four lanes. <span className="italic">One vision.</span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <ServiceCard
            title="Music & Production"
            desc="Recording engineering, artist development, studio liaison work, and music supervision for film and brand."
            href="/music"
          />
          <ServiceCard
            title="Business & Branding"
            desc="Full-spectrum brand strategy, visual identity, pitch decks, digital ecosystems, and executive consulting."
            href="/business"
          />
          <ServiceCard
            title="Website Starter Kits"
            desc="DIY guide + template or done-with-you buildout. Real booking, real Stripe, real emails. From $47."
            href="/products"
          />
          <ServiceCard
            title="Portfolio Work"
            desc="Websites, campaigns, visuals, resumes, and identity systems — production-grade creative output."
            href="/portfolio"
          />
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-24 bg-ink-2">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-10">What People Say</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Testimonial
              quote="He doesn't just understand music — he understands the business behind it. That's rare."
              name="Industry Collaborator"
              title="Music Executive"
            />
            <Testimonial
              quote="The brand strategy he delivered for us was unlike anything we'd seen from a boutique studio."
              name="Brand Partner"
              title="Founder, Consumer Brand"
            />
            <Testimonial
              quote="He walked into the room knowing the culture and walked out knowing our numbers. That's the guy you want."
              name="Former Client"
              title="Entrepreneur"
            />
          </div>
        </div>
      </section>

      {/* ── BOOKING ──────────────────────────────────── */}
      <section id="booking" className="py-24 md:py-32 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="border border-white/8 bg-ink-2 p-10 hover:border-gold/30 transition-colors duration-400">
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">No Commitment</p>
            <h3 className="font-display text-3xl text-cream font-light mb-4">Free 15-Min<br /><span className="italic">Discovery Call</span></h3>
            <p className="font-sans text-sm text-mist leading-relaxed mb-8">
              Let's see if we're aligned. Tell us about your project, your vision, and where you're stuck. Zero pressure, full attention.
            </p>
            <CtaLink href="/booking?type=free" variant="outline">Schedule Free Call</CtaLink>
          </div>

          {/* Paid */}
          <div className="border border-gold/30 bg-ink-2 p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl" />
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">Strategy Session</p>
            <h3 className="font-display text-3xl text-cream font-light mb-4">$500 / Hour<br /><span className="italic">Consultation</span></h3>
            <p className="font-sans text-sm text-mist leading-relaxed mb-8">
              Deep-dive brand audit, creative direction, or growth strategy. You leave with a clear plan and the confidence to execute.
            </p>
            <CtaLink href="/booking?type=paid" variant="gold">Book Strategy Session</CtaLink>
          </div>
        </div>
      </section>

      {/* ── EMAIL CAPTURE ─────────────────────────────── */}
      <section className="py-20 bg-ink-2 border-y border-white/5">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">Stay in the Loop</p>
          <h2 className="font-display text-3xl md:text-4xl text-cream font-light mb-8">
            Strategy notes. <span className="italic">When they're worth sharing.</span>
          </h2>
          <form
            action="https://formspree.io/f/YOUR_FORM_ID" // ← replace with Formspree or your preferred handler
            method="POST"
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
              className="flex-1 bg-ink border border-white/10 px-5 py-3.5 text-sm text-cream placeholder:text-mist/50 font-sans focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3.5 bg-gold text-ink text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300 whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
          <p className="font-sans text-xs text-mist/50 mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </>
  );
}
