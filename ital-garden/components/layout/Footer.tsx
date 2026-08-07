import Link from "next/link";
import { CONTACT, HOURS_SUMMARY, NAV_LINKS, SOCIAL } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-charcoal">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <p className="font-display text-2xl text-cream">
            I-tal <span className="text-gold-gradient">Garden</span>
          </p>
          <p className="mt-3 max-w-xs font-body text-sm text-mist">
            Plant-based soul food, cooked ital, served in New Orleans.
          </p>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-turmeric">Visit</p>
          <address className="not-italic font-body text-sm leading-relaxed text-cream/80">
            {CONTACT.addressLine1}
            <br />
            {CONTACT.addressLine2}
            <br />
            <a href={CONTACT.phoneHref} className="hover:text-gold">
              {CONTACT.phone}
            </a>
          </address>
          <p className="mt-3 font-body text-sm text-cream/80">{HOURS_SUMMARY}</p>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-turmeric">Menu</p>
          <ul className="space-y-2 font-body text-sm text-cream/80">
            {NAV_LINKS.filter((l) => l.href !== "/").map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-turmeric">Follow</p>
          <ul className="space-y-2 font-body text-sm text-cream/80">
            <li>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Instagram — {SOCIAL.instagramHandle}
              </a>
            </li>
            <li>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                Facebook
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
                {CONTACT.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60 px-6 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center md:flex-row md:text-left">
          <p className="font-mono text-xs italic text-mist">Ital is vital — fresh, organic, and made to nourish.</p>
          <p className="font-mono text-xs text-mist">
            © {new Date().getFullYear()} I-tal Garden. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
