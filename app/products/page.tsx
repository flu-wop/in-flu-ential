import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, PanelText, Accordion, Cta } from "@/components/studio/Studio";
import k from "@/components/studio/studio.module.css";

export const metadata: Metadata = {
  title: "Starter Kits | IN-FLU-ENTIAL LLC",
  description: "Website starter kits for creatives and artists: a DIY guide and template, or a done-with-you buildout.",
};

const KITS = [
  {
    name: "DIY starter kit",
    price: "$47",
    period: "one-time",
    tagline: "Everything you need to launch it yourself in a weekend.",
    includes: [
      "Plain-English setup guide for your industry",
      "Starter Next.js template: clone, fill in your info, push",
      "Booking form with a Stripe deposit flow",
      "Turso database and Resend email confirmations",
      "Setup checklist from zero to live",
      "Lifetime access to guide updates",
    ],
    cta: "Get the kit",
  },
  {
    name: "Done-with-you",
    price: "$297",
    period: "one-time",
    tagline: "We get you live together on one call.",
    includes: [
      "Everything in the DIY kit",
      "90-minute screen share from zero to live",
      "Domain setup and Vercel deployment handled",
      "Your services, prices and about copy added",
      "30 days of questions by DM after launch",
      "Sessions book within the week",
    ],
    cta: "Book a session",
    featured: true,
  },
];

const NICHES = ["Estheticians and waxing studios", "Hair stylists and barbers", "DJs and music artists", "Photographers and videographers", "Personal trainers and coaches", "Visual artists and designers"];

const FAQ = [
  { q: "Do I need to know how to code?", a: "For the DIY kit, basic comfort with a terminal and following instructions. The guide is written for first-timers. For done-with-you, nothing: we handle all of it on the call." },
  { q: "Can I build this from my iPhone?", a: "The first setup needs a Mac or PC for about two to three hours. After launch you can edit content from your phone with GitHub's mobile editor, and changes deploy automatically." },
  { q: "How is this different from Squarespace or Wix?", a: "You own the code and the data, and pay nothing monthly beyond your domain (about $12 a year). Hosting on Vercel is free, and bookings charge clients directly to your Stripe with no platform taking a cut." },
  { q: "Can I change the colors and branding?", a: "Yes. The template is built to be reskinned, and the guide shows you how to swap your palette, fonts and logo in one config file." },
];

export default function ProductsPage() {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 05 · Kits"
        title={
          <>
            Your first website, <em>done right</em>
          </>
        }
        lede="Real booking, real Stripe payments and real email confirmations. Not a drag-and-drop template: the same stack behind Epoch Skin and Mid City Sound."
        meta={[
          ["From", "$47"],
          ["Monthly fees", "$0"],
          ["Live in", "A weekend"],
        ]}
      />

      <Panel title="Kits · Choose your path" meta="2 options">
        <div className={k.cards}>
          {KITS.map((kit) => (
            <div className={`${k.card} ${kit.featured ? k.featured : ""}`} key={kit.name}>
              <div className={k.cardSlot}>
                <span>{kit.name}</span>
                {kit.featured && <span className={k.tag}>Most chosen</span>}
              </div>
              <div className={k.cardPrice}>
                {kit.price}
                <small>{kit.period}</small>
              </div>
              <p className={k.cardText}>{kit.tagline}</p>
              <ul className={k.list}>
                {kit.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <div style={{ marginTop: "auto", paddingTop: 6 }}>
                <Cta href="/booking?service=Starter%20kit%20help" solid={kit.featured}>
                  {kit.cta}
                </Cta>
              </div>
            </div>
          ))}
        </div>
        <PanelText>No payment until we&apos;ve talked and you know it fits.</PanelText>
      </Panel>

      <Panel title="Built for" meta={`${NICHES.length} trades`}>
        <div className={k.chips}>
          {NICHES.map((n) => (
            <span className={k.chip} key={n} style={{ fontSize: 12, padding: "6px 10px" }}>
              {n}
            </span>
          ))}
        </div>
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
