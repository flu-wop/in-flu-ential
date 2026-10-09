import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, Accordion, Cta } from "@/components/studio/Studio";
import k from "@/components/studio/studio.module.css";

export const metadata: Metadata = {
  title: "Work | IN-FLU-ENTIAL LLC",
  description: "Every website IN-FLU-ENTIAL LLC has built, grouped by industry, with live links.",
};

interface Site {
  name: string;
  url: string;
  shot: string; // /public/work/<shot>.webp
  blurb: string;
  built: string[];
}

// Screenshots live in /public/work. To add a site: add an entry here and a
// 960x600 .webp screenshot with the matching name.
const CATEGORIES: { title: string; sites: Site[] }[] = [
  {
    title: "Artists and music",
    sites: [
      { name: "Graham Hill", url: "https://graham-hill.vercel.app", shot: "graham-hill", blurb: "Campaign site for the Beach House drummer's self-titled debut LP.", built: ["Album campaign", "Sync licensing", "Press"] },
      { name: "Donald Markowitz", url: "https://www.donaldmarkowitz.com", shot: "donald-markowitz", blurb: "Artist site for the Academy Award-winning composer and producer.", built: ["Credits", "Catalog", "Merch"] },
      { name: "Tyron Benoit Band", url: "https://tyron-benoit.vercel.app", shot: "tyron-benoit", blurb: "Song campaign site for “Hope You Find Heaven.”", built: ["Song campaign", "Press kit"] },
      { name: "Doug Belote", url: "https://dougbelote.vercel.app", shot: "doug-belote", blurb: "Site for the New Orleans drummer and percussionist.", built: ["Credits", "Media", "Booking"] },
      { name: "DJ Jade the Gem", url: "https://www.dahiddengem.com", shot: "jade-the-gem", blurb: "DJ site with mixes, events and direct booking.", built: ["Booking", "Mixes", "Events"] },
      { name: "Lil Squiggle", url: "https://lilsquiggle.vercel.app", shot: "lil-squiggle", blurb: "Release site for “Don't Drink & Dial,” with a merch shop.", built: ["Release site", "Shop"] },
      { name: "Street Beat", url: "https://nolastreetbeat.vercel.app", shot: "streetbeat", blurb: "Documentary site with a paid streaming paywall.", built: ["Paywall", "Stripe", "Trailer"] },
    ],
  },
  {
    title: "Studios and production",
    sites: [
      { name: "Mid City Sound Studios", url: "https://www.midcitysound.com", shot: "mid-city-sound", blurb: "Recording studio site with session booking and Stripe checkout.", built: ["Booking", "Stripe", "Calendar invites"] },
      { name: "Fire on the Bayou", url: "https://fireonthebayou.vercel.app", shot: "fire-on-the-bayou", blurb: "Video production house making commercials and brand films in New Orleans.", built: ["Showreel", "Portfolio"] },
      { name: "Breaks In The Simulation", url: "https://bits-weld.vercel.app", shot: "bits", blurb: "Artist wellness and creative services organization.", built: ["Programs", "Events"] },
    ],
  },
  {
    title: "Beauty and retail",
    sites: [
      { name: "Epoch Skin", url: "https://epoch-skin.com", shot: "epoch-skin", blurb: "Waxing studio and organic skincare brand.", built: ["Booking", "Store", "Automated newsletter"] },
      { name: "Liquid Gold Skin Co.", url: "https://www.liquidgoldskinco.com", shot: "liquid-gold", blurb: "Island-inspired body care store.", built: ["Store", "Square checkout", "Admin panel"] },
      { name: "EGOFF Essentials", url: "https://www.egoffessentials.com", shot: "egoff", blurb: "Luxury handcrafted natural soap brand.", built: ["Brand site", "Checkout"] },
      { name: "Akua Method", url: "https://akua-method.vercel.app", shot: "akua-method", blurb: "Luxury perfume oils inspired by Ghanaian heritage.", built: ["Store", "Brand story"] },
      { name: "MVC Creations", url: "https://mvc-creations.vercel.app", shot: "mvc-creations", blurb: "Nail artist in Kenner, with chair booking.", built: ["Booking", "Gallery"] },
    ],
  },
  {
    title: "Local business",
    sites: [
      { name: "Bourbon Daiquiris Wings & Things", url: "https://bourbondaiquiris.vercel.app", shot: "bourbon-daiquiris", blurb: "Westbank daiquiri and wings spot with a build-your-cup menu.", built: ["Menu builder", "Ordering"] },
      { name: "Flu-Haul", url: "https://www.fluhaul.com", shot: "flu-haul", blurb: "Junk removal company with instant quotes and booking.", built: ["Quotes", "Booking", "Stripe"] },
      { name: "A&B Supply & Surplus", url: "https://www.absupply.us", shot: "ab-supply", blurb: "Industrial surplus and heavy equipment parts store.", built: ["Store", "Stripe"] },
      { name: "Once In A Room", url: "https://once-in-a-room.vercel.app", shot: "once-in-a-room", blurb: "Interior design consultations, booked online.", built: ["Booking", "Portfolio"] },
    ],
  },
];

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");
const total = CATEGORIES.reduce((n, c) => n + c.sites.length, 0);

export default function WorkPage() {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 03 · Work"
        title={
          <>
            Sites that <em>ship</em>
          </>
        }
        lede="Every site here is live. Booking systems, stores, paywalls and campaigns, built for artists and local businesses. Open a category, then tap through to the real thing."
        meta={[
          ["Sites live", String(total)],
          ["Categories", String(CATEGORIES.length)],
          ["Based", "New Orleans"],
        ]}
        actions={<Cta href="/booking" solid>Start a project</Cta>}
      />

      <Panel title="Session · Builds" meta={`${total} sites`}>
        <div>
          {CATEGORIES.map((cat, ci) => (
            <Accordion key={cat.title} title={cat.title} meta={`${cat.sites.length} sites`} open={ci === 0}>
              <div className={k.sites}>
                {cat.sites.map((site) => (
                  <article className={k.site} key={site.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className={k.shot}
                      src={`/work/${site.shot}.webp`}
                      alt={`${site.name} homepage`}
                      loading="lazy"
                      width={960}
                      height={600}
                    />
                    <div className={k.siteBody}>
                      <span className={k.siteName}>{site.name}</span>
                      <span className={k.siteUrl}>{host(site.url)}</span>
                      <p className={k.cardText}>{site.blurb}</p>
                      <div className={k.chips}>
                        {site.built.map((b) => (
                          <span className={k.chip} key={b}>
                            {b}
                          </span>
                        ))}
                      </div>
                      <a className={k.siteLink} href={site.url} target="_blank" rel="noopener noreferrer">
                        Visit site ↗
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </Accordion>
          ))}
        </div>
      </Panel>
    </StudioPage>
  );
}
