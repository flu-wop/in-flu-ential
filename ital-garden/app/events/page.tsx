import type { Metadata } from "next";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CONTACT, SITE, SOCIAL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Cooking classes, nutrition workshops, themed dining nights, and private gatherings at I-tal Garden in New Orleans. Follow @italgardennola for the current calendar.",
  alternates: { canonical: "/events" },
  openGraph: { title: `Events — ${SITE.name}`, url: "/events" },
};

const EVENT_TYPES = [
  {
    title: "Cooking Classes",
    description: "Hands-on sessions where Chef Ra walks the room through ital technique — how to make soul food plant-based without losing the soul.",
  },
  {
    title: "Nutrition Workshops",
    description: "Conversations on eating ital day-to-day: what it means, why it matters, and how to bring it home.",
  },
  {
    title: "Themed Dining Nights",
    description: "Seasonal, community-style dinners built around a theme — announced on Instagram as they're booked.",
  },
  {
    title: "Private Gatherings",
    description: "Book the space for a birthday, celebration, or community meeting — plant-based catering included.",
  },
];

export default function EventsPage() {
  return (
    <>
      <Section className="pb-10 pt-16 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Community</Eyebrow>
            <SectionHeading>
              Come eat with <span className="italic text-gold">us</span>.
            </SectionHeading>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-mist">
              I-tal Garden is a gathering place as much as a kitchen. Beyond regular hours, Chef Ra hosts
              cooking classes, workshops, and themed dinners for the neighborhood.
            </p>
            <p className="mt-4 font-body text-sm text-mist">
              The calendar changes — the fastest way to catch what&rsquo;s next is{" "}
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">
                {SOCIAL.instagramHandle}
              </a>{" "}
              on Instagram.
            </p>
          </div>
          <PhotoSlot label="Community dinner / cooking class in progress" aspect="aspect-[4/3]" />
        </div>
      </Section>

      <Section className="border-t border-border/60 bg-charcoal/60">
        <Eyebrow>What We Host</Eyebrow>
        <SectionHeading className="mb-12">
          Four ways to <span className="italic text-turmeric">gather</span>
        </SectionHeading>
        <div className="grid gap-6 md:grid-cols-2">
          {EVENT_TYPES.map((e) => (
            <Card key={e.title}>
              <CardContent className="p-8">
                <h3 className="font-display text-xl text-cream">{e.title}</h3>
                <p className="mt-3 font-body text-sm leading-relaxed text-mist">{e.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="text-center">
        <SectionHeading>
          Planning something <span className="italic text-gold">bigger</span>?
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-md font-body text-mist">
          For private events, space rental, or a custom themed night, email us directly and Chef Ra&rsquo;s team
          will work out the details.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={`mailto:${CONTACT.email}`}>Email {CONTACT.email}</Button>
          <Button href="/catering" variant="outline">
            See Catering
          </Button>
        </div>
        <p className="mt-3 text-sm text-mist">We&rsquo;ll reply with availability — no obligation to book.</p>
      </Section>
    </>
  );
}
