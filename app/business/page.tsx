import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText, Rows, Accordion, Cta } from "@/components/studio/Studio";
import k from "@/components/studio/studio.module.css";
import CheckoutButton from "@/components/checkout/CheckoutButton";
import { stripeReady } from "@/lib/stripe";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { SITE_COUNT } from "@/lib/work";

export const metadata: Metadata = {
  title: "Business | IN-FLU-ENTIAL LLC",
  description:
    "Websites from $3,000, social media marketing with a website from $5,000, custom AI tools for contractors, and a $50 starter kit.",
};

const LANES = [
  {
    slot: "Lane A",
    title: "Websites",
    text: "Production sites with real booking, payments, stores and email confirmations. You own the code and the data, with no monthly platform fees.",
    chips: ["Booking", "Stripe or Square", "Stores", "Paywalls"],
    id: undefined,
  },
  {
    slot: "Lane B",
    title: "Social Media Marketing",
    text: "A strategy built for your business and run for at least 30 days, with your website built in. Keep it going afterward on a monthly retainer.",
    chips: ["Strategy", "Content Calendar", "Short-Form Video"],
    id: undefined,
  },
  {
    slot: "Lane C",
    title: "AI for Contractors and Industrial",
    text: "Ten years in industrial demolition, from general labor to project manager. I build AI tools for contractors because I've done the work they're still doing by hand: estimating, scheduling, job documentation and bids.",
    chips: ["Estimating", "Scheduling", "Job Docs", "Bids"],
    id: "ai",
  },
];

interface Checkout {
  label: string;
  product?: ProductId; // pays on the page with Stripe when set
  service: string; // inquiry form preselect otherwise
}

interface Pkg {
  name: string;
  price: string;
  terms: string;
  tagline: string;
  includes: string[];
  featured?: boolean;
  tag?: string;
  checkout: Checkout;
}

const PACKAGES: Pkg[] = [
  {
    name: "Website",
    price: "$3,000",
    terms: "$1,500 to start · $1,500 before launch",
    tagline: "A production site you own, built on the same stack as every site in Work.",
    includes: [
      "Custom design for your brand",
      "Booking, store or paywall where you need it",
      "Stripe or Square payments",
      "Email confirmations",
      "Two rounds of revisions",
      "Domain setup, launch and a handoff doc with every login",
    ],
    checkout: { label: "Pay $1,500 Deposit", product: "website-deposit", service: "Website Build" },
  },
  {
    name: "Social Media Marketing",
    price: "$5,000",
    terms: "$2,500 to start · $2,500 before launch",
    tagline: "Strategy built and run for at least 30 days, with the website included.",
    includes: [
      "Everything in Website",
      "Brand Positioning and Strategy",
      "Content Calendar",
      "Short-form video and clips",
      "At least 30 days of running the campaign",
      "Two rounds of revisions on the strategy",
    ],
    featured: true,
    tag: "Website Included",
    checkout: { label: "Pay $2,500 Deposit", product: "social-deposit", service: "Campaign or Artist Rollout" },
  },
  {
    name: "AI for Contractors",
    price: "Custom quote",
    terms: "Scoped after a walkthrough",
    tagline: "Tools built around how your jobs actually run.",
    includes: ["Walkthrough of your current process", "Written scope and price", "Estimating, scheduling or job docs", "Training for your team"],
    checkout: { label: "Request a Quote", service: "AI Tools for My Business" },
  },
];

const KIT_INCLUDES = [
  "Plain-English setup guide for your industry",
  "Starter Next.js template: clone, fill in your info, push",
  "Booking form with a Stripe deposit flow",
  "Turso database and Resend email confirmations",
  "Setup checklist from zero to live",
  "Lifetime access to guide updates",
];

const STEPS = [
  { title: "Call", text: "A short conversation about what you're building and where you are now." },
  { title: "Deposit", text: "Scope, timeline and price in writing. Half down starts the work." },
  { title: "Build", text: "You see progress on a live link the whole way, with two rounds of revisions." },
  { title: "Launch", text: "The balance is due before launch. Then your domain goes live and you get the handoff doc." },
];

const FAQ = [
  { q: "When is the rest of the payment due?", a: "Half is due to start. The balance is due before your site goes live on your domain, or before your campaign launches." },
  { q: "What counts as a revision?", a: "A round is one set of changes sent together. Two rounds are included. Changes beyond that, or new features, are quoted before any work starts." },
  { q: "What happens after the first 30 days of marketing?", a: "You can stop there with the strategy, calendar and content in hand, or keep it running on a monthly retainer from $500 to $1,000 a month." },
  { q: "Do I need to know how to code for the starter kit?", a: "Basic comfort with a terminal and following instructions. The guide is written for first-timers, step by step." },
  { q: "How is the starter kit different from Squarespace or Wix?", a: "You own the code and the data, and pay nothing monthly beyond your domain (about $12 a year). Hosting on Vercel is free, and bookings charge clients directly to your Stripe." },
];

// Pays on the page through Stripe when keys are set and the product is
// available; otherwise opens the inquiry form for that package.
function Checkout({ c, title, solid }: { c: Checkout; title: string; solid?: boolean }) {
  if (c.product && stripeReady() && PRODUCTS[c.product].available)
    return <CheckoutButton product={c.product} label={c.label} title={title} solid={solid} />;
  const label = c.label.startsWith("Pay") ? "Start This Package" : c.label;
  return (
    <Cta href={`/booking?service=${encodeURIComponent(c.service)}`} solid={solid}>
      {label}
    </Cta>
  );
}

export default function BusinessPage() {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 02 · Business"
        title={
          <>
            Where the Boardroom <em>Meets the Booth</em>
          </>
        }
        lede="Websites, social media marketing and AI tools for artists, local businesses and contractors, built by someone who has worked every side of the room."
        meta={[
          ["Sites live", String(SITE_COUNT)],
          ["Music credits", "29"],
          ["Field years", "10"],
        ]}
        actions={
          <>
            <Cta href="/booking" solid>
              Start a Project
            </Cta>
            <Cta href="/portfolio">See the Work</Cta>
          </>
        }
      />

      <Panel title="Lanes · What I build" meta="3 lanes" heading="Three Ways to Work Together">
        <div className={k.cards}>
          {LANES.map((l) => (
            <div className={k.card} key={l.title} id={l.id}>
              <div className={k.cardSlot}>
                <span>{l.slot}</span>
              </div>
              <h3 className={k.cardTitle}>{l.title}</h3>
              <p className={k.cardText}>{l.text}</p>
              <div className={k.chips}>
                {l.chips.map((c) => (
                  <span className={k.chip} key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Rates · Packages" meta="Half down to start" heading="Packages">
        <div className={k.cards}>
          {PACKAGES.map((t) => (
            <div className={`${k.card} ${t.featured ? k.featured : ""}`} key={t.name}>
              <div className={k.cardSlot}>
                <span>{t.name}</span>
                {t.tag && <span className={k.tag}>{t.tag}</span>}
              </div>
              <div className={k.cardPrice}>{t.price}</div>
              <span className={k.cardNote}>{t.terms}</span>
              <p className={k.cardText}>{t.tagline}</p>
              <ul className={k.list}>
                {t.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <div style={{ marginTop: "auto", paddingTop: 6 }}>
                <Checkout c={t.checkout} title={t.name} solid={t.featured} />
              </div>
            </div>
          ))}
        </div>
        <PanelText>After launch, keep things running month to month.</PanelText>
        <Rows
          rows={[
            ["Site care: updates, fixes, small edits", "from $150 / mo"],
            ["Marketing retainer: keep the campaign running", "$500–1,000 / mo"],
          ]}
        />
      </Panel>

      <Panel title="Kit · Do it yourself" meta="One-time" heading="Website Starter Kit · $50" id="kit">
        <PanelText>
          For smaller budgets: the same booking and payments stack as the sites in Work, with a guide that takes you
          from zero to live in a weekend.
        </PanelText>
        <ul className={k.list}>
          {KIT_INCLUDES.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <div>
          {PRODUCTS["starter-kit"].available ? (
            <Checkout c={{ label: "Get the Kit · $50", product: "starter-kit", service: "Starter Kit Help" }} title="Starter Kit" />
          ) : (
            <Cta href="/booking?service=Starter%20Kit%20Help">Coming Soon · Get Notified</Cta>
          )}
        </div>
      </Panel>

      <Panel title="Routing · How it runs" meta="4 steps">
        <ol className={k.steps}>
          {STEPS.map((st) => (
            <li key={st.title}>
              <strong>{st.title}</strong>
              <span>{st.text}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel title="Questions" meta={`${FAQ.length} answers`}>
        <div>
          {FAQ.map((f) => (
            <Accordion key={f.q} title={f.q}>
              <p className={k.cardText} style={{ fontSize: 15 }}>
                {f.a}
              </p>
            </Accordion>
          ))}
        </div>
      </Panel>
    </StudioPage>
  );
}
