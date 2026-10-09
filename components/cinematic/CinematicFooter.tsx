import Link from "next/link";
import { Wordmark } from "./CinematicNav";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Channels",
    links: [
      { label: "Console", href: "/" },
      { label: "Music", href: "/music" },
      { label: "Business", href: "/business" },
      { label: "Work", href: "/portfolio" },
      { label: "Vault", href: "/vault" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Websites", href: "/business" },
      { label: "Social media marketing", href: "/business" },
      { label: "AI for contractors", href: "/business#ai" },
      { label: "Starter kit", href: "/business#kit" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Start a project", href: "/booking" },
      { label: "Mid City Sound", href: "https://midcitysound.com" },
      { label: "flu.wop@gmail.com", href: "mailto:flu.wop@gmail.com" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/flu_wop" },
  { label: "X", href: "https://x.com/its_FluWop" },
];

const mono = { fontFamily: "DM Mono, monospace" } as const;

export default function CinematicFooter() {
  return (
    <footer className="bg-[#080808] border-t border-[#34322C]">
      <div className="max-w-[960px] mx-auto px-4 md:px-10 py-14 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <Wordmark size="lg" />
          <Link
            href="/booking"
            className="self-start md:self-auto px-6 py-3.5 text-[11px] tracking-[0.35em] uppercase text-[#080808] bg-[#D4AF77] hover:bg-[#E8C97A] transition-colors duration-300"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Start a project
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <span className="text-[9px] tracking-[0.3em] text-[#D4AF77] uppercase" style={mono}>
                {col.title}
              </span>
              {col.links.map((l) =>
                l.href.startsWith("http") || l.href.startsWith("mailto") ? (
                  <a
                    key={l.label}
                    href={l.href}
                    className="text-[13px] text-[#A89880] hover:text-[#F5EDD8] transition-colors break-words"
                    {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.label} href={l.href} className="text-[13px] text-[#A89880] hover:text-[#F5EDD8] transition-colors">
                    {l.label}
                  </Link>
                )
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-[#34322C]">
          <span className="text-[10px] text-[#8F887A] tracking-[0.15em]" style={mono}>
            © {new Date().getFullYear()} IN-FLU-ENTIAL LLC ·{" "}
            <Link href="/privacy" className="hover:text-[#F5EDD8]">
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href="/terms" className="hover:text-[#F5EDD8]">
              Terms
            </Link>
          </span>
          <div className="flex items-center gap-6">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.25em] text-[#A89880] hover:text-[#D4AF77] transition-colors uppercase"
                style={mono}
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
