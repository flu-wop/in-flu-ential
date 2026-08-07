import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CONTACT, LINKS, SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Catering",
  description:
    "I-tal Garden caters birthdays, holidays, corporate events, and weddings with fully plant-based New Orleans soul food. Groups of 50+ and space rental available.",
  alternates: { canonical: "/catering" },
  openGraph: { title: `Catering — ${SITE.name}`, url: "/catering" },
};

const OCCASIONS = [
  "Birthday Parties",
  "Holiday Parties",
  "Corporate Events",
  "Weddings",
  "Private Dining",
  "Community Gatherings",
];

export default function CateringPage() {
  return (
    <>
      <Section className="pb-10 pt-16 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Catering</Eyebrow>
            <SectionHeading>
              Feed your people, <span className="italic text-gold">plant-powered</span>.
            </SectionHeading>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-mist">
              Chef Ra brings the same ital soul food from St. Claude Ave to your event — trays built for
              sharing, seasoned like it&rsquo;s Sunday dinner.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={LINKS.cateringOrder} external>
                Start a Catering Order
              </Button>
            </div>
            <p className="mt-3 text-sm text-mist">
              No deposit to inquire — pricing depends on headcount and menu.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/catering-spread.jpg"
              alt="I-tal Garden catering spread"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>

      <Section className="border-t border-border/60 bg-charcoal/60">
        <Eyebrow>Occasions We Cater</Eyebrow>
        <SectionHeading className="mb-10">
          Every table, <span className="italic text-turmeric">covered</span>
        </SectionHeading>
        <div className="flex flex-wrap gap-3">
          {OCCASIONS.map((o) => (
            <Badge key={o} className="px-4 py-2 text-[13px] normal-case tracking-normal">
              {o}
            </Badge>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Large Groups</Eyebrow>
            <SectionHeading>
              Parties of <span className="italic text-gold">50+</span>
            </SectionHeading>
            <p className="mt-6 font-body text-base leading-relaxed text-mist">
              For groups of 50 or more, or to inquire about renting the space for your event, email us
              directly and we&rsquo;ll work out a plan that fits your headcount and budget.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={`mailto:${CONTACT.email}`}>Email {CONTACT.email}</Button>
              <Button href={CONTACT.phoneHref} variant="outline">
                Call {CONTACT.phone}
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image
              src="/images/assorted-topview.jpg"
              alt="An assortment of I-tal Garden dishes"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </Section>
    </>
  );
}
