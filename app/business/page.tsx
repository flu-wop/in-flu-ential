import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText, Rows, Cta } from "@/components/studio/Studio";
import k from "@/components/studio/studio.module.css";

export const metadata: Metadata = {
  title: "Business | IN-FLU-ENTIAL LLC",
  description: "Websites from $3,000, social media marketing with a website from $5,000, and custom AI tools for contractors.",
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
    text: "Social media marketing for artists and local businesses: positioning, content calendars, short-form video and launch campaigns, with your website built in.",
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

const PACKAGES = [
  {
    name: "Website",
    price: "$3,000",
    deposit: "$1,500 deposit to start",
    tagline: "A production site you own, built on the same stack as every site in Work.",
    includes: [
      "Custom design for your brand",
      "Booking, store or paywall where you need it",
      "Stripe or Square payments",
      "Email confirmations",
      "Domain setup and launch",
      "Handoff doc with every login",
    ],
  },
  {
    name: "Social media marketing",
    price: "$5,000",
    deposit: "$2,500 deposit to start",
    tagline: "A full campaign with the website included.",
    includes: [
      "Everything in Website",
      "Brand positioning",
      "Content calendar",
      "Short-form video and clips",
      "Launch or release campaign",
    ],
    featured: true,
  },
  {
    name: "AI for contractors",
    price: "Custom quote",
    deposit: "Scoped after a walkthrough",
    tagline: "Tools built around how your jobs actually run.",
    includes: ["Walkthrough of your current process", "Written scope and price", "Estimating, scheduling or job docs", "Training for your team"],
  },
];

const STEPS = [
  { title: "Call", text: "A short conversation about what you're building and where you are now." },
  { title: "Proposal", text: "Scope, timeline and price in writing. Half down starts the build." },
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

      <Panel title="Rates · Packages" meta="Half down to start" heading="Packages">
        <div className={k.cards}>
          {PACKAGES.map((t) => (
            <div className={`${k.card} ${t.featured ? k.featured : ""}`} key={t.name}>
              <div className={k.cardSlot}>
                <span>{t.name}</span>
                {t.featured && <span className={k.tag}>Website included</span>}
              </div>
              <div className={k.cardPrice}>{t.price}</div>
              <span className={k.cardNote}>{t.deposit}</span>
              <p className={k.cardText}>{t.tagline}</p>
              <ul className={k.list}>
                {t.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <PanelText>Doing it yourself? The website starter kit is $50.</PanelText>
        <div>
          <Cta href="/products">See the starter kit</Cta>
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
