import Link from "next/link";
import type { ReactNode } from "react";
import type React from "react";
import CinematicNav from "@/components/cinematic/CinematicNav";
import CinematicFooter from "@/components/cinematic/CinematicFooter";
import PatchBay from "./PatchBay";
import s from "./studio.module.css";

// The studio kit: every subpage is built from these so it matches the console.

export function StudioPage({ children }: { children: ReactNode }) {
  return (
    <main className={s.page}>
      <CinematicNav />
      <div className={s.inner}>
        <PatchBay />
        {children}
      </div>
      <CinematicFooter />
    </main>
  );
}

export function ChannelHeader({
  channel,
  title,
  lede,
  meta,
  actions,
}: {
  channel: string; // e.g. "Channel 01 · Music"
  title: ReactNode;
  lede?: ReactNode;
  meta?: [string, string][];
  actions?: ReactNode;
}) {
  return (
    <header className={s.header}>
      <span className={s.eyebrow}>{channel}</span>
      <h1 className={s.title}>{title}</h1>
      {lede && <p className={s.lede}>{lede}</p>}
      {meta && (
        <div className={s.meta} style={{ "--cols": meta.length } as React.CSSProperties}>
          {meta.map(([label, value]) => (
            <div className={s.metaItem} key={label}>
              <span className={s.metaLabel}>{label}</span>
              <span className={s.metaValue}>{value}</span>
            </div>
          ))}
        </div>
      )}
      {actions && <div className={s.actions}>{actions}</div>}
    </header>
  );
}

export function Panel({
  title,
  meta,
  heading,
  id,
  children,
}: {
  title: string;
  meta?: string;
  heading?: ReactNode;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section className={s.panel} id={id}>
      <div className={s.panelBar}>
        <span className={s.panelTitle}>{title}</span>
        {meta && <span className={s.panelMeta}>{meta}</span>}
      </div>
      <div className={s.panelBody}>
        {heading && <h2 className={s.panelHeading}>{heading}</h2>}
        {children}
      </div>
    </section>
  );
}

export function PanelText({ children }: { children: ReactNode }) {
  return <p className={s.panelText}>{children}</p>;
}

export function Rows({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className={s.rows}>
      {rows.map(([a, b], i) => (
        <div className={s.row} key={i}>
          <span>{a}</span>
          <span className={s.rowValue}>{b}</span>
        </div>
      ))}
    </div>
  );
}

export function Cta({ href, children, solid }: { href: string; children: ReactNode; solid?: boolean }) {
  const external = href.startsWith("http");
  const cls = solid ? s.ctaSolid : s.cta;
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children} <span aria-hidden="true">↗</span>
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  );
}

export function Scribble({ children }: { children: ReactNode }) {
  return <span className={s.scribble}>{children}</span>;
}

// Native <details> so it works without JS and is keyboard friendly.
export function Accordion({
  title,
  meta,
  open,
  children,
}: {
  title: ReactNode;
  meta?: string;
  open?: boolean;
  children: ReactNode;
}) {
  return (
    <details className={s.acc} open={open}>
      <summary className={s.accHead}>
        <span className={s.accTitle}>{title}</span>
        <span className={s.accMeta}>
          {meta}
          <span className={s.accIcon} aria-hidden="true" />
        </span>
      </summary>
      <div className={s.accBody}>{children}</div>
    </details>
  );
}
