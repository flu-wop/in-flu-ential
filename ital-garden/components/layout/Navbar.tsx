"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_LINKS, LINKS } from "@/lib/site-config";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-studio-black/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/images/logo.png" alt="I-tal Garden" width={38} height={52} className="h-11 w-auto" priority />
          <span className="hidden font-display text-xl tracking-wide text-cream sm:inline">
            I-tal <span className="text-gold-gradient">Garden</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-1 font-body text-sm tracking-wide transition-colors ${
                  active ? "text-gold" : "text-cream/80 hover:text-cream"
                }`}
              >
                {link.label}
                {active && <span className="absolute -bottom-0.5 left-0 h-px w-full bg-gold-gradient" />}
              </Link>
            );
          })}
          <a
            href={LINKS.order}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-gold-gradient px-5 py-2 font-body text-sm font-medium text-studio-black transition hover:brightness-110"
          >
            Order Online
          </a>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-6 bg-cream transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-cream transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-cream transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border/60 bg-studio-black px-6 pb-6 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-lg px-3 py-3 font-body text-sm ${
                pathname === link.href ? "bg-gold/10 text-gold" : "text-cream/85"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <a
            href={LINKS.order}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 rounded-full bg-gold-gradient px-5 py-3 text-center font-body text-sm font-medium text-studio-black"
          >
            Order Online
          </a>
        </nav>
      )}
    </header>
  );
}
