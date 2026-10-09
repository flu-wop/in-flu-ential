import type { CSSProperties } from "react";
import { StudioPage, ChannelHeader, Panel, PanelText, Cta } from "@/components/studio/Studio";
import s from "./music.module.css";

const LANES = ["#4E9C8F", "#D4AF77", "#8A6BB0", "#4C77B4", "#B2412F", "#3D8753"];

// What was actually done on each: produced, recorded (engineered), or both.
const CREDITS: { artist: string; role: string; description: string; did: string[] }[] = [
  {
    artist: "Curren$y",
    role: "In-house producer / engineer",
    description: "Sustained creative partnership. Production, engineering, and session coordination across multiple projects, including Hang Glider.",
    did: ["Produced", "Recorded"],
  },
  {
    // Credit formalization in progress via Reid Whick; update wording once confirmed.
    artist: "Killer Mike — MICHAEL",
    role: "Engineering",
    description: "Engineering credit on the album that won Best Rap Album at the 2024 Grammys.",
    did: ["Recorded"],
  },
  {
    artist: "Trapaganda",
    role: "Production",
    description: "Flagship project released through Jet Life and EMPIRE.",
    did: ["Produced"],
  },
  {
    artist: "Wiz Khalifa",
    role: "Producer",
    description: "Production on two records featuring Wiz Khalifa, one released and one unreleased.",
    did: ["Produced"],
  },
  {
    artist: "Quando Rondo",
    role: "Producer / engineer",
    description: "Produced and recorded.",
    did: ["Produced", "Recorded"],
  },
  {
    artist: "NoCap",
    role: "Producer / engineer",
    description: "Produced and recorded.",
    did: ["Produced", "Recorded"],
  },
  {
    artist: "Boosie Badazz",
    role: "Producer",
    description: "Production for the Baton Rouge legend.",
    did: ["Produced"],
  },
  {
    artist: "Kevin Gates",
    role: "Recording engineer",
    description: "Recording sessions.",
    did: ["Recorded"],
  },
  {
    artist: "Flau'jae",
    role: "Recording engineer",
    description: "Recording sessions.",
    did: ["Recorded"],
  },
  {
    artist: "MadeinTYO",
    role: "Recording engineer",
    description: "Recording sessions.",
    did: ["Recorded"],
  },
  {
    artist: "Donald Markowitz",
    role: "Ongoing collaborator",
    description: "Extensive, ongoing work together across records and Mid City Sound.",
    did: ["Produced", "Recorded"],
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
        lede="Producer and engineer, and manager of Mid City Sound Studios in New Orleans since 2024. Artist development and music supervision, rooted in real sessions rather than theory."
        meta={[
          ["Credits", "29"],
          ["Managing", "Mid City Sound"],
          ["Since", "2024"],
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
            <div className={s.track} key={c.artist} style={{ "--lane": LANES[i % LANES.length] } as CSSProperties}>
              <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
              <div className={s.main}>
                <div className={s.top}>
                  <span className={s.artist}>{c.artist}</span>
                  <span className={s.role}>{c.role}</span>
                </div>
                <p className={s.desc}>{c.description}</p>
                <div className={s.tags}>
                  {c.did.map((t) => (
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
