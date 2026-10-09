import type { Metadata } from "next";
import { StudioPage, ChannelHeader, Panel, Accordion, Cta } from "@/components/studio/Studio";
import k from "@/components/studio/studio.module.css";
import { CATEGORIES, SITE_COUNT } from "@/lib/work";

export const metadata: Metadata = {
  title: "Work | IN-FLU-ENTIAL LLC",
  description: "Every website IN-FLU-ENTIAL LLC has built, grouped by industry, with live links.",
};

const host = (u: string) => new URL(u).hostname.replace(/^www\./, "");
const total = SITE_COUNT;

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
          ["Stack", "Next.js"],
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
