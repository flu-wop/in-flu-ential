"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const links = [
  { href: "/music", label: "Music" },
  { href: "/business", label: "Business" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/vault", label: "Vault" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-ink/90 backdrop-blur-md border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* Replace /public/logo.png with your actual logo file */}
          <div className="w-8 h-8 rounded-sm overflow-hidden">
            <img src="/logo.png" alt="IN-FLU-ENTIAL" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.style.display = "none")} />
          </div>
          <span className="font-display text-sm tracking-widest2 text-cream uppercase font-light">
            IN-FLU-ENTIAL
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-sans text-xs tracking-widest uppercase transition-colors duration-200 gold-link ${
                pathname === href ? "text-gold" : "text-mist hover:text-cream"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#booking"
            className="ml-4 px-5 py-2 border border-gold/60 text-gold text-xs tracking-widest uppercase font-sans hover:bg-gold hover:text-ink transition-all duration-300"
          >
            Book Now
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-cream transition-all duration-300 ${open ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-px bg-cream transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-px bg-cream transition-all duration-300 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-400 overflow-hidden ${open ? "max-h-96 border-b border-white/5" : "max-h-0"}`}>
        <div className="bg-ink/95 backdrop-blur-md px-6 py-6 flex flex-col gap-5">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`font-sans text-xs tracking-widest uppercase ${pathname === href ? "text-gold" : "text-mist"}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#booking"
            className="mt-2 px-5 py-3 border border-gold/60 text-gold text-xs tracking-widest uppercase text-center"
          >
            Book Now
          </Link>
        </div>
      </div>
    </header>
  );
}
