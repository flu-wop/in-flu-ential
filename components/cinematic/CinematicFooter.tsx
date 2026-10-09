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
      { label: "Social Media Marketing", href: "/business" },
      { label: "AI for Contractors", href: "/business#ai" },
      { label: "Starter Kit", href: "/business#kit" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Mid City Sound", href: "https://midcitysound.com" },
      { label: "flu.wop@gmail.com", href: "mailto:flu.wop@gmail.com" },
    ],
  },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/flu_wop",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/its_FluWop",
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
      </svg>
    ),
  },
];

const mono = { fontFamily: "DM Mono, monospace" } as const;

export default function CinematicFooter() {
  return (
    <footer className="bg-[#080808] border-t border-[#34322C]">
      <div className="max-w-[960px] mx-auto px-4 md:px-10 py-14 flex flex-col gap-10">
        <Wordmark size="lg" />

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
              {col.title === "Contact" && (
                <div className="flex items-center gap-3 pt-1">
                  {SOCIALS.map((so) => (
                    <a
                      key={so.label}
                      href={so.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={so.label}
                      className="w-9 h-9 grid place-items-center rounded-full border border-[#4A473E] text-[#A89880] hover:text-[#D4AF77] hover:border-[#D4AF77] transition-colors"
                    >
                      {so.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-[#34322C]">
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
        </div>
      </div>
    </footer>
  );
}
