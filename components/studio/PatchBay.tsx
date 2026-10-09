"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import s from "./patchbay.module.css";

// The subpage navigation: a patch bay. A cable runs from the desk output into
// the jack for the current page. Choosing another jack pulls the cable, swings
// it over, patches it in, then navigates.

const JACKS = [
  { label: "Music", short: "Music", href: "/music" },
  { label: "Business", short: "Biz", href: "/business" },
  { label: "Work", short: "Work", href: "/portfolio" },
  { label: "Book", short: "Book", href: "/booking" },
  { label: "Kits", short: "Kits", href: "/products" },
  { label: "Vault", short: "Vault", href: "/vault" },
];

type Pt = { x: number; y: number };

function cablePath(a: Pt, b: Pt, lift = 0) {
  const dist = Math.abs(b.x - a.x);
  const sag = Math.min(46, 14 + dist * 0.16) - lift * 0.6;
  return `M ${a.x} ${a.y} C ${a.x + 6} ${a.y + sag}, ${b.x - 6} ${b.y + sag}, ${b.x} ${b.y}`;
}

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export default function PatchBay() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const srcRef = useRef<HTMLAnchorElement>(null);
  const jackRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pts, setPts] = useState<{ src: Pt; jacks: Pt[]; h: number } | null>(null);
  const [plug, setPlug] = useState<{ end: Pt; lift: number } | null>(null);
  const animating = useRef(false);

  const current = JACKS.findIndex((j) => pathname.startsWith(j.href));

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap || !srcRef.current) return;
    const r = wrap.getBoundingClientRect();
    const center = (el: HTMLElement): Pt => {
      const hole = el.querySelector<HTMLElement>("[data-hole]") ?? el;
      const b = hole.getBoundingClientRect();
      return { x: b.left + b.width / 2 - r.left, y: b.top + b.height / 2 - r.top };
    };
    setPts({
      src: center(srcRef.current),
      jacks: jackRefs.current.map((el) => (el ? center(el) : { x: 0, y: 0 })),
      h: r.height,
    });
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    JACKS.forEach((j) => router.prefetch(j.href));
    router.prefetch("/");
  }, [router]);

  // Resting position: plugged into the current page's jack, or hanging loose.
  const restEnd = (): Pt | null => {
    if (!pts) return null;
    if (current >= 0) return pts.jacks[current];
    return { x: pts.src.x + 26, y: pts.src.y + 34 };
  };

  const go = (e: React.MouseEvent, href: string, index: number) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (index === current) {
      e.preventDefault();
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const from = restEnd();
    const to = index >= 0 ? pts?.jacks[index] : pts?.src;
    if (reduced || !from || !to || animating.current) return; // plain navigation
    e.preventDefault();
    animating.current = true;
    const start = performance.now();
    const dur = 620;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const k = ease(t);
      const end = { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k - Math.sin(Math.PI * t) * 26 };
      setPlug({ end, lift: Math.sin(Math.PI * t) * 26 });
      if (t < 1) requestAnimationFrame(step);
      else {
        setTimeout(() => {
          animating.current = false;
          router.push(href);
        }, 120);
      }
    };
    requestAnimationFrame(step);
  };

  const end = plug?.end ?? restEnd();
  const lift = plug?.lift ?? 0;
  const loose = !plug && current < 0;

  return (
    <nav className={s.bay} aria-label="Patch bay">
      <div className={s.bar}>
        <span>Patch bay</span>
        <span className={s.barMeta}>{current >= 0 ? `Desk out → ${JACKS[current].label}` : "Desk out · unpatched"}</span>
      </div>
      <div className={s.row} ref={wrapRef}>
        <Link href="/" ref={srcRef} className={`${s.jack} ${s.source}`} onClick={(e) => go(e, "/", -1)}>
          <span className={s.label}>
            <span className={s.full}>Desk out</span>
            <span className={s.short}>Out</span>
          </span>
          <span className={s.socket} data-hole>
            <span className={s.hole} />
          </span>
          <span className={s.sub}>Console</span>
        </Link>
        <span className={s.divider} aria-hidden="true" />
        {JACKS.map((j, i) => (
          <Link
            key={j.href}
            href={j.href}
            ref={(el) => {
              jackRefs.current[i] = el;
            }}
            className={`${s.jack} ${i === current ? s.active : ""}`}
            aria-current={i === current ? "page" : undefined}
            onClick={(e) => go(e, j.href, i)}
          >
            <span className={s.label}>
              <span className={s.full}>{j.label}</span>
              <span className={s.short}>{j.short}</span>
            </span>
            <span className={s.socket} data-hole>
              <span className={s.hole} />
            </span>
            <span className={s.sub}>{String(i + 1).padStart(2, "0")}</span>
          </Link>
        ))}

        {pts && end && (
          <svg className={s.cable} width="100%" height={pts.h} aria-hidden="true">
            <path d={cablePath(pts.src, end, lift)} className={s.cableUnder} />
            <path d={cablePath(pts.src, end, lift)} className={s.cableTop} />
            <circle cx={pts.src.x} cy={pts.src.y} r={6.5} className={s.plug} />
            {loose ? (
              <rect x={end.x - 4} y={end.y - 2} width={8} height={12} rx={2} className={s.plug} />
            ) : (
              <circle cx={end.x} cy={end.y} r={6.5} className={s.plug} />
            )}
          </svg>
        )}
      </div>
    </nav>
  );
}
