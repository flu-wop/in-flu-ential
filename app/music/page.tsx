import type { CSSProperties } from "react";
import { StudioPage, ChannelHeader, Panel, PanelText, Cta } from "@/components/studio/Studio";
import s from "./music.module.css";

const CREDITS = [
  {
    artist: "Curren$y",
    role: "In-house producer / engineer",
    description: "Sustained creative partnership. Production, engineering, and session coordination across multiple projects, including Hang Glider.",
    tags: ["Hip-hop", "2018–2021"],
    lane: "#4E9C8F",
  },
  {
    // Credit formalization in progress via Reid Whick; update wording once confirmed.
    artist: "Killer Mike — MICHAEL",
    role: "Engineering",
    description: "Engineering credit on the album that won Best Rap Album at the 2024 Grammys.",
    tags: ["Hip-hop", "Grammy-winning album"],
    lane: "#D4AF77",
  },
  {
    artist: "Trapaganda",
    role: "Production",
    description: "Flagship project released through Jet Life and EMPIRE.",
    tags: ["Jet Life / EMPIRE"],
    lane: "#8A6BB0",
  },
  {
    artist: "Zaytoven",
    role: "Recording engineer",
    description: "Studio sessions with the Atlanta producer behind Gucci Mane, Future, and YG.",
    tags: ["Trap", "2019"],
    lane: "#4C77B4",
  },
  {
    artist: "NoCap",
    role: "Recording engineer",
    description: "Session work with the Alabama rapper during his breakthrough period.",
    tags: ["Hip-hop", "2020"],
    lane: "#B2412F",
  },
  {
    artist: "Boosie Badazz",
    role: "Recording engineer",
    description: "Studio work with the Baton Rouge legend and Louisiana rap icon.",
    tags: ["Southern rap", "2019–2020"],
    lane: "#3D8753",
  },
];

// The order is the order a record moves through: tracked, developed, placed, released.
const SERVICES = [
  {
    title: "Recording and engineering",
    text: "Sessions at Mid City Sound Studios in New Orleans. Pro Tools, treated rooms, and an experienced engineer on every session.",
    note: "Single-mic demos to full band tracking.",
  },
  {
    title: "Artist development",
    text: "Brand identity, image direction, press kit, social strategy, and a release roadmap for artists who are serious about longevity.",
    note: "Strategy first. Content second. Culture third.",
  },
  {
    title: "Music supervision",
    text: "Sync licensing and placement for film, TV, and brand campaigns. We know both sides of the table.",
    note: "Placement that actually fits.",
  },
  {
    title: "Release strategy",
    text: "From pre-save to playlist pitching to DSP optimization, every day of the rollout has a purpose.",
    note: "Single, EP, or album. The full arc.",
  },
];

export default function MusicPage() {
  return (
    <StudioPage>
      <ChannelHeader
        channel="Channel 01 · Music"
        title={
          <>
            Built in the <em>studio</em>
          </>
        }
        lede="Production and engineering credits, artist development, and music supervision, rooted in real sessions rather than theory."
        meta={[
          ["Credits", "29"],
          ["Home room", "Mid City Sound"],
          ["Based", "New Orleans"],
        ]}
        actions={
          <>
            <Cta href="/booking" solid>
              Book a session
            </Cta>
            <Cta href="https://midcitysound.com">Mid City Sound</Cta>
          </>
        }
      />

      <Panel title="Session · Credits" meta={`${CREDITS.length} lanes`} heading="Who we've been in the room with">
        <div className={s.tracks}>
          {CREDITS.map((c, i) => (
            <div className={s.track} key={c.artist} style={{ "--lane": c.lane } as CSSProperties}>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <div className={s.main}>
                <div className={s.top}>
                  <span className={s.artist}>{c.artist}</span>
                  <span className={s.role}>{c.role}</span>
                </div>
                <p className={s.desc}>{c.description}</p>
                <div className={s.tags}>
                  {c.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Inserts · Services" meta="Signal flows A → D" heading="Music services that move things">
        <PanelText>Each service is an insert on the chain. Use one, or run a record through all four.</PanelText>
        <div className={s.inserts}>
          {SERVICES.map((svc, i) => (
            <div className={s.insert} key={svc.title}>
              <div className={s.slot}>
                <span>Insert {String.fromCharCode(65 + i)}</span>
                <span className={s.led} aria-hidden="true" />
              </div>
              <h3 className={s.insertTitle}>{svc.title}</h3>
              <p className={s.insertText}>{svc.text}</p>
              <p className={s.insertNote}>{svc.note}</p>
            </div>
          ))}
        </div>
      </Panel>
    </StudioPage>
  );
}
