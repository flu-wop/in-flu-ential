import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <p className="font-display text-xl text-cream tracking-wide">IN-FLU-ENTIAL LLC</p>
            <p className="font-sans text-xs text-mist tracking-widest uppercase leading-loose">
              Global Roots.<br />Executive Vision.<br />Creative Execution.
            </p>
          </div>

          {/* Nav */}
          <div className="space-y-4">
            <p className="font-sans text-xs text-gold tracking-widest uppercase">Navigate</p>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/", label: "Home" },
                { href: "/music", label: "Music" },
                { href: "/business", label: "Business" },
                { href: "/portfolio", label: "Portfolio" },
                { href: "/vault", label: "Private Vault" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="font-sans text-sm text-mist hover:text-cream transition-colors gold-link w-fit">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <p className="font-sans text-xs text-gold tracking-widest uppercase">Connect</p>
            <div className="flex flex-col gap-2.5">
              <a href="mailto:hello@influential.llc" className="font-sans text-sm text-mist hover:text-cream transition-colors gold-link w-fit">
                hello@influential.llc
              </a>
              <Link href="/#booking" className="font-sans text-sm text-mist hover:text-cream transition-colors gold-link w-fit">
                Book a Free Call
              </Link>
              <Link href="/#booking" className="font-sans text-sm text-mist hover:text-cream transition-colors gold-link w-fit">
                $500/hr Consultation
              </Link>
            </div>
          </div>
        </div>

        <div className="divider-gold mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-mist font-sans tracking-wide">
          <p>© {new Date().getFullYear()} IN-FLU-ENTIAL LLC. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
