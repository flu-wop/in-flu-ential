"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Music", href: "/music" },
  { label: "Business", href: "/business" },
  { label: "Work", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Vault", href: "/vault" },
];

export function Wordmark({ size = "sm" }: { size?: "sm" | "lg" }) {
  return (
    <span className="inline-flex items-baseline gap-2 whitespace-nowrap leading-none">
      <span
        className={`${size === "lg" ? "text-[clamp(1.6rem,6vw,2.4rem)]" : "text-[17px] md:text-[19px]"} tracking-[0.2em] text-[#D4AF77] uppercase`}
        style={{ fontFamily: "Cormorant Garamond, serif" }}
      >
        IN-FLU-ENTIAL
      </span>
      <span
        className={`${size === "lg" ? "text-[11px]" : "text-[9px]"} tracking-[0.3em] text-[#A89880] uppercase`}
        style={{ fontFamily: "DM Mono, monospace" }}
      >
        LLC
      </span>
    </span>
  );
}

export default function CinematicNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-6 px-4 md:px-10 border-b border-[#34322C]/70 bg-[#080808]/90 backdrop-blur-md"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 14px)", paddingBottom: 14 }}
      >
        <Link href="/" aria-label="IN-FLU-ENTIAL LLC home">
          <Wordmark />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${active ? "text-[#D4AF77]" : "text-[#A89880] hover:text-[#F5EDD8]"}`}
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/booking"
            className="text-[11px] tracking-[0.3em] text-[#080808] bg-[#D4AF77] px-5 py-2.5 uppercase hover:bg-[#E8C97A] transition-colors duration-300"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Start a project
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-[#D4AF77] border border-[#D4AF77]/40 px-3 py-2"
          style={{ fontFamily: "DM Mono, monospace" }}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 bg-[#080808] md:hidden flex flex-col px-6"
          style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 96px)" }}
        >
          <Link
            href="/"
            className="py-4 border-b border-[#34322C] text-2xl text-[#F5EDD8]"
            style={{ fontFamily: "Cormorant Garamond, serif" }}
          >
            Console
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="py-4 border-b border-[#34322C] text-2xl text-[#F5EDD8]"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/booking"
            className="mt-8 text-center px-6 py-4 bg-[#D4AF77] text-[#080808] text-[11px] tracking-[0.35em] uppercase"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Start a project
          </Link>
        </div>
      )}
    </>
  );
}
