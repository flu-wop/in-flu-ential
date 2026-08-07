import type { Metadata } from "next";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { CONTACT, HOURS, LINKS, SITE, SOCIAL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact & Location",
  description:
    "Visit I-tal Garden at 2372 St. Claude Ave, Suite 130, New Orleans, LA 70116. Hours, phone, directions, and how to reach us.",
  alternates: { canonical: "/contact" },
  openGraph: { title: `Contact & Location — ${SITE.name}`, url: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Section className="pb-10 pt-16 md:pt-20">
        <Eyebrow>Contact & Location</Eyebrow>
        <SectionHeading>
          Find us on <span className="italic text-gold">St. Claude</span>
        </SectionHeading>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-10">
            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-turmeric">Address</p>
              <address className="not-italic font-body text-lg leading-relaxed text-cream">
                {CONTACT.addressLine1}
                <br />
                {CONTACT.addressLine2}
              </address>
              <Button href={CONTACT.mapsUrl} external variant="outline" className="mt-4">
                Get Directions
              </Button>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-turmeric">Hours</p>
              <table className="w-full max-w-xs font-body text-sm text-cream/90">
                <tbody>
                  {HOURS.map((h) => (
                    <tr key={h.day} className="border-b border-border/40 last:border-0">
                      <td className="py-2 text-mist">{h.day}</td>
                      <td className="py-2 text-right">{h.hours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-turmeric">Reach Us</p>
              <ul className="space-y-2 font-body text-base text-cream/90">
                <li>
                  <a href={CONTACT.phoneHref} className="hover:text-gold">
                    {CONTACT.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`} className="hover:text-gold">
                    {CONTACT.email}
                  </a>
                </li>
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
              </ul>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-turmeric">Join the Team</p>
              <p className="max-w-sm font-body text-sm leading-relaxed text-mist">
                I-tal Garden is always open to hearing from people who want to cook. See current openings on
                our ordering partner&rsquo;s site.
              </p>
              <Button href={LINKS.jobs} external variant="outline" className="mt-4">
                View Openings
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title={`Map to ${SITE.name}`}
              src={CONTACT.mapsEmbedSrc}
              className="h-full min-h-[420px] w-full grayscale invert-[92%] contrast-[90%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
