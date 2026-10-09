import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText, Rows, Cta } from "@/components/studio/Studio";
import k from "@/components/studio/studio.module.css";

export const metadata: Metadata = {
  title: "Business | IN-FLU-ENTIAL LLC",
  description: "Websites, campaigns, and AI tools for artists, local businesses, and contractors. Engagements from $10,000.",
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
    title: "Campaigns",
    text: "Artist rollouts and brand campaigns: positioning, content calendars, short-form video and release strategy, run by someone who has been in the room.",
    chips: ["Release strategy", "Social", "Video"],
    id: undefined,
  },
  {
    slot: "Lane C",
    title: "AI for contractors and industrial",
    text: "Ten years in industrial demolition, from general labor to project manager. I build AI tools for contractors because I've done the work they're still doing by hand: estimating, scheduling, job documentation and bids.",
    chips: ["Estimating", "Scheduling", "Job docs", "Bids"],
    id: "ai",
  },
];

const TIERS = [
  {
    name: "Growth",
    price: "$10,000",
    period: "per project",
    tagline: "Brand clarity and a content system that actually works.",
    includes: ["Brand positioning audit", "Social strategy and 30-day calendar", "30-day content sprint", "One full creative campaign"],
  },
  {
    name: "Influence",
    price: "$25,000",
    period: "per quarter",
    tagline: "Full-service creative direction and an ongoing partnership.",
    includes: ["Everything in Growth", "Monthly creative direction sessions", "Video and media production", "Press and partnership brokerage", "Direct access via Signal"],
    featured: true,
  },
  {
    name: "Legacy",
    price: "$50,000+",
    period: "per engagement",
    tagline: "Executive-level brand architecture for those building for decades.",
    includes: ["Everything in Influence", "Brand architecture and legacy roadmap", "Business development advisory", "Revenue stream mapping", "Priority access on all initiatives"],
  },
];

const STEPS = [
  { title: "Call", text: "A short conversation about what you're building and where you are now." },
  { title: "Proposal", text: "Scope, timeline and price in writing, before any money moves." },
  { title: "Build", text: "You see progress on a live link the whole way, not a reveal at the end." },
  { title: "Launch", text: "Domain, handoff notes and logins, plus support after it's live." },
];

export default function BusinessPage() {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 02 · Business"
        title={
          <>
            Where the boardroom <em>meets the booth</em>
          </>
        }
        lede="Websites, campaigns and AI tools for artists, local businesses and contractors, built by someone who has worked every side of the room."
        meta={[
          ["Sites live", "19"],
          ["Music credits", "29"],
          ["Field years", "10"],
        ]}
        actions={
          <>
            <Cta href="/booking" solid>
              Start a project
            </Cta>
            <Cta href="/portfolio">See the work</Cta>
          </>
        }
      />

      <Panel title="Lanes · What I build" meta="3 lanes" heading="Three ways to work together">
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

      <Panel title="Rates · Engagements" meta="Written first" heading="Engagements">
        <div className={k.cards}>
          {TIERS.map((t) => (
            <div className={`${k.card} ${t.featured ? k.featured : ""}`} key={t.name}>
              <div className={k.cardSlot}>
                <span>{t.name}</span>
                {t.featured && <span className={k.tag}>Most chosen</span>}
              </div>
              <div className={k.cardPrice}>
                {t.price}
                <small>{t.period}</small>
              </div>
              <p className={k.cardText}>{t.tagline}</p>
              <ul className={k.list}>
                {t.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <PanelText>Need something smaller? Starter kits for your first site begin at $47.</PanelText>
        <div>
          <Cta href="/products">See starter kits</Cta>
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

      <Panel title="Behind the desk" meta="James Afflu · Flu" heading="Who you're working with">
        <p className={k.bio}>
          James Afflu, known as Flu, is a producer, engineer and builder based in New Orleans. Born to Ghanaian
          parents and shaped by Toronto and Chicago, he spent ten years in industrial demolition, working his way
          from general labor to project manager, while building a music career alongside it: production for
          Curren$y, Boosie Badazz and records featuring Wiz Khalifa, and an engineering credit on Killer Mike&apos;s
          MICHAEL. He has managed Mid City Sound Studios since 2024. Today he runs IN-FLU-ENTIAL LLC, building
          websites, campaigns and AI tools for artists, local businesses and contractors.
        </p>
        <Rows
          rows={[
            ["Roots", "Ghana"],
            ["Shaped in", "Toronto · Chicago"],
            ["Home", "New Orleans"],
          ]}
        />
      </Panel>
    </StudioPage>
  );
}
