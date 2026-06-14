import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
const TextReveal     = dynamic(() => import("@/components/TextReveal"),     { ssr: false });
const StoryTimeline  = dynamic(() => import("@/components/StoryTimeline"),  { ssr: false });

export const metadata: Metadata = {
  title: "Business & Branding",
  description: "Full-spectrum brand strategy, visual identity, pitch decks, and executive consulting. Packages from $5k–$25k+.",
};

function PackageCard({
  tier, price, desc, features, highlight,
}: {
  tier: string; price: string; desc: string; features: string[]; highlight?: boolean;
}) {
  return (
    <div className={`border p-8 flex flex-col h-full transition-all duration-400 hover:-translate-y-1 ${highlight ? "border-gold/50 bg-ink-2 relative overflow-hidden" : "border-white/8 bg-ink-2"}`}>
      {highlight && (
        <>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
          <span className="absolute top-4 right-4 font-sans text-[10px] text-ink bg-gold px-3 py-1 tracking-widest uppercase">Most Popular</span>
        </>
      )}
      <p className="font-sans text-xs text-gold tracking-widest uppercase mb-2">{tier}</p>
      <p className="font-display text-4xl text-cream font-light mb-3">{price}</p>
      <p className="font-sans text-sm text-mist mb-6 leading-relaxed">{desc}</p>
      <ul className="space-y-2.5 flex-1 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 font-sans text-xs text-cream-dim">
            <span className="text-gold mt-0.5 shrink-0">—</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/#booking"
        className={`block text-center px-6 py-3 text-xs tracking-widest uppercase font-sans transition-all duration-300 ${highlight ? "bg-gold text-ink hover:bg-gold-light" : "border border-gold/40 text-gold hover:bg-gold hover:text-ink"}`}
      >
        Get Started
      </Link>
    </div>
  );
}

function CaseStudy({ client, result, services }: { client: string; result: string; services: string[] }) {
  return (
    <div className="border border-white/8 bg-ink-2 p-8 hover:border-gold/30 transition-colors duration-400">
      <p className="font-sans text-xs text-gold tracking-widest uppercase mb-3">{client}</p>
      <p className="font-display text-xl text-cream font-light leading-snug mb-4">"{result}"</p>
      <div className="flex flex-wrap gap-2">
        {services.map((s) => (
          <span key={s} className="font-sans text-[11px] text-mist border border-white/10 px-3 py-1">{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function BusinessPage() {
  return (
    <>
      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gold/4 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6 fade-up">Business & Branding</p>
          <h1 className="font-display font-light text-5xl sm:text-6xl md:text-7xl text-cream leading-tight max-w-4xl fade-up-delay-1">
            The execution mindset,<br />applied to <span className="italic text-gold">your brand.</span>
          </h1>
          <p className="font-sans text-base text-mist max-w-xl leading-relaxed mt-6 fade-up-delay-2">
            From industrial project management to premium brand builds — the same discipline, systems thinking, and attention to detail that moves a $2M demolition job now moves creative campaigns and company identities.
          </p>
        </div>
      </section>

      {/* ── BIO ────────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-[1fr_380px] gap-16 items-start">
          <div>
            <p className="font-sans text-xs text-gold tracking-widest uppercase mb-6">The Founder</p>
            <h2 className="font-display text-4xl text-cream font-light mb-6 leading-tight">
              A story built across<br /><span className="italic">three continents.</span>
            </h2>
            <div className="space-y-4 font-sans text-sm text-mist leading-relaxed">
              <p>
                Born to Ghanaian parents, raised between Toronto, Chicago, and New Orleans — a trajectory that was never going to be conventional. That multicultural foundation became the lens through which everything else is understood: music, business, culture, and the spaces where they overlap.
              </p>
              <p>
                The music industry came first. Internships with Fee Banks and Abby Urbina. A viral SXSW moment alongside Boosie Badazz. Sessions shadowing Zaytoven across Atlanta and Los Angeles. Then the defining role: in-house producer and recording engineer for Curren$y, inside the Jet Life ecosystem where excellence is the baseline.
              </p>
              <p>
                Simultaneously — and this is the part most people miss — a parallel career in industrial demolition was being built. Not as a detour, but as a discipline. Rising from field operator to project manager on multi-million dollar projects taught systems thinking, stakeholder management, deadline execution, and the kind of pressure-tested leadership that creative studios rarely possess.
              </p>
              <p>
                Artist development work with former New Orleans Saints players added another dimension: athletes transitioning identities, building personal brands, navigating public life. High stakes, high scrutiny, high reward.
              </p>
              <p className="text-cream font-medium">
                Now, alongside creative partner Donny Markowitz, IN-FLU-ENTIAL LLC channels all of it into high-level creative strategy, brand development, and execution for clients who demand more than aesthetics — they demand results.
              </p>
            </div>
          </div>

          {/* Credential sidebar */}
          <div className="space-y-4">
            {[
              { label: "Background", value: "Ghanaian Heritage · Toronto · Chicago · New Orleans" },
              { label: "Music Credits", value: "Curren$y, NoCap, Zaytoven, Boosie Badazz" },
              { label: "Industries", value: "Music · Entertainment · Industrial · Sports" },
              { label: "Collaborators", value: "Donny Markowitz · Fee Banks · Abby Urbina" },
              { label: "Services", value: "Brand Strategy · Creative Direction · Digital Ecosystems" },
              { label: "Packages", value: "$5,000 – $25,000+" },
            ].map(({ label, value }) => (
              <div key={label} className="border-b border-white/8 pb-4">
                <p className="font-sans text-[10px] text-gold tracking-widest uppercase mb-1">{label}</p>
                <p className="font-sans text-sm text-cream-dim">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCROLLYTELLING TIMELINE ─────────────────── */}
      <StoryTimeline />

      <div className="divider-gold max-w-7xl mx-auto px-6 md:px-10" />

      {/* ── PACKAGES ───────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Branding Packages</p>
        <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-12 leading-tight">
          Investment levels.<br /><span className="italic">Real results.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          <PackageCard
            tier="Foundation"
            price="$5,000"
            desc="For early-stage founders and artists who need a sharp, strategic identity fast."
            features={[
              "Brand positioning & strategy session",
              "Logo & core visual identity",
              "Color system & typography",
              "One-page brand guidelines",
              "Social profile setup",
              "2 revision rounds",
            ]}
          />
          <PackageCard
            tier="Executive"
            price="$12,500"
            highlight
            desc="For established businesses ready to level up with a complete brand ecosystem."
            features={[
              "Everything in Foundation",
              "Full brand guidelines document",
              "Custom website (up to 5 pages)",
              "Pitch deck design (12–16 slides)",
              "Content strategy framework",
              "3-month creative direction retainer",
              "3 revision rounds",
            ]}
          />
          <PackageCard
            tier="Enterprise"
            price="$25,000+"
            desc="For premium brands, major artists, and companies demanding full-service creative leadership."
            features={[
              "Everything in Executive",
              "Full digital ecosystem build",
              "Campaign creative direction",
              "Ongoing executive consulting",
              "Media & PR strategy",
              "Team creative direction",
              "Priority access & dedicated support",
            ]}
          />
        </div>
        <p className="font-sans text-xs text-mist mt-6 text-center">
          All packages begin with a discovery call. Custom scopes available. Hourly consulting at $500/hr.
        </p>
      </section>

      <div className="divider-gold max-w-7xl mx-auto px-6 md:px-10" />

      {/* ── CASE STUDIES ───────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
        <p className="font-sans text-xs text-gold tracking-widest uppercase mb-10">Case Studies</p>
        <div className="grid md:grid-cols-3 gap-5">
          <CaseStudy
            client="Music Artist — Brand Launch"
            result="From zero online presence to 10k followers in 90 days with a cohesive identity and content system."
            services={["Brand Identity", "Content Strategy", "Social Setup"]}
          />
          <CaseStudy
            client="Former NFL Athlete — Transition Brand"
            result="Built a personal brand that opened doors to speaking engagements, sponsorships, and media coverage within 6 months."
            services={["Personal Branding", "Pitch Deck", "Website"]}
          />
          <CaseStudy
            client="Entrepreneur — Investor Pitch"
            result="Redesigned pitch deck and brand narrative secured a first-round investor meeting within 3 weeks of delivery."
            services={["Pitch Deck", "Brand Strategy", "Messaging"]}
          />
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────── */}
      <section className="py-20 bg-ink-2 border-y border-white/5">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-sans text-xs text-gold tracking-widest uppercase mb-4">Start the Conversation</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream font-light mb-8">
            Your brand deserves<br /><span className="italic">executive attention.</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/#booking" className="inline-block bg-gold text-ink px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold-light transition-colors duration-300">
              Free Discovery Call
            </Link>
            <Link href="/#booking" className="inline-block border border-gold/50 text-gold px-8 py-3.5 text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-ink transition-all duration-300">
              Book $500/hr Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
