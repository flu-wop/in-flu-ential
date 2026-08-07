import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { MealPrepVignette } from "@/components/vignettes/MealPrepVignette";
import { CONTACT, HOURS_SUMMARY, LINKS, SITE } from "@/lib/site-config";
import { MENU } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: `${SITE.name} — Plant-Based Soul Food in New Orleans`,
  description:
    "I-tal Garden serves fully plant-based Creole and soul food classics from Chef Ra in New Orleans — order online, book catering, or stop by St. Claude Ave.",
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE.name} — Plant-Based Soul Food in New Orleans`,
    description:
      "Chef Ra's plant-based take on New Orleans soul food. Order online, book catering, or visit us on St. Claude Ave.",
    url: "/",
  },
};

const mains = MENU.find((s) => s.id === "mains")?.items ?? [];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <Section className="pt-16 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>New Orleans · Fully Plant-Based</Eyebrow>
            <h1 className="font-display text-5xl font-light leading-[1.05] text-cream md:text-6xl">
              Soul food, made <span className="text-gold-gradient italic">whole</span>.
            </h1>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-mist">
              Chef Ra cooks the New Orleans classics you grew up on — plant by plant, no substitutes
              apologized for. Fully vegan. Fully soul.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={LINKS.order} external>
                Order Online
              </Button>
              <Button href="/menu" variant="outline">
                View Menu
              </Button>
            </div>
            <p className="mt-3 text-sm text-mist">
              Ordering opens in our partner site — no account needed to browse the menu first.
            </p>
          </div>
          <PhotoSlot label="Hero — plated signature dish, natural light" aspect="aspect-[4/5]" />
        </div>
      </Section>

      {/* Concept statement */}
      <Section className="border-y border-border/60 bg-charcoal/60">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>What Ital Means</Eyebrow>
          <SectionHeading>
            Vital food, cooked with <span className="italic text-turmeric">intention</span>.
          </SectionHeading>
          <p className="mt-6 font-body text-base leading-relaxed text-mist">
            &ldquo;Ital&rdquo; comes from &ldquo;vital&rdquo; — food closest to the earth, prepared to nourish, not just
            to fill. Chef Ra brings that discipline to New Orleans soul food: greens, grains, jackfruit, and
            coconut milk standing in for a lifetime of Creole technique, so nothing about the flavor gets lost
            in the swap.
          </p>
        </div>
      </Section>

      {/* Menu teaser */}
      <Section>
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Eyebrow>From the Kitchen</Eyebrow>
            <SectionHeading>
              Comfort food that loves you <span className="italic text-gold">back</span>.
            </SectionHeading>
          </div>
          <Link href="/menu" className="font-body text-sm text-gold hover:text-gold-light">
            View full menu →
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {mains.map((item) => (
            <Card key={item.name}>
              <PhotoSlot label={item.name} aspect="aspect-[4/3]" className="rounded-b-none border-b-0" />
              <CardContent>
                <h3 className="font-display text-xl text-cream">{item.name}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-mist">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Chef Ra teaser */}
      <Section className="border-y border-border/60 bg-charcoal/60">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <PhotoSlot label="Chef Ra in the kitchen" aspect="aspect-square" />
          <div>
            <Eyebrow>Family-Owned</Eyebrow>
            <SectionHeading>
              Cooking is Chef Ra&rsquo;s <span className="italic text-gold">ministry</span>.
            </SectionHeading>
            <p className="mt-6 font-body text-base leading-relaxed text-mist">
              I-tal Garden is family-owned and operated, built around Chef Ra&rsquo;s belief that food should
              be flavorful and balanced at once — organic where it counts, seasoned like it grew up in New
              Orleans, because it did.
            </p>
            <div className="mt-8">
              <Button href="/about" variant="outline">
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Meal Prep cross-promo */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Sister Service</Eyebrow>
            <SectionHeading>
              Ital eating, <span className="italic text-turmeric">delivered</span>.
            </SectionHeading>
            <p className="mt-6 font-body text-base leading-relaxed text-mist">
              Can&rsquo;t make it to St. Claude Ave every week? I-tal Meal Prep packages Chef Ra&rsquo;s plant-based
              plates for pickup — order a week of ital eating in one go.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href={LINKS.mealPrep} external>
                Visit I-tal Meal Prep
              </Button>
            </div>
            <p className="mt-3 text-sm text-mist">Separate menu and ordering — same ital standard.</p>
          </div>
          <div className="flex justify-center md:justify-end">
            <MealPrepVignette />
          </div>
        </div>
      </Section>

      {/* Catering + Events teaser */}
      <Section className="border-t border-border/60 bg-charcoal/60">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardContent className="flex h-full flex-col p-8">
              <Badge variant="secondary">Catering</Badge>
              <h3 className="mt-4 font-display text-2xl text-cream">
                Feed your people, <span className="italic text-gold">plant-powered</span>.
              </h3>
              <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-mist">
                Birthdays, holidays, corporate lunches, weddings — Chef Ra caters it all-plant. Ask about
                space rental for parties of 50+.
              </p>
              <Button href="/catering" variant="outline" className="mt-6 self-start">
                Catering Info
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex h-full flex-col p-8">
              <Badge variant="secondary">Events</Badge>
              <h3 className="mt-4 font-display text-2xl text-cream">
                Come eat with <span className="italic text-gold">community</span>.
              </h3>
              <p className="mt-3 flex-1 font-body text-sm leading-relaxed text-mist">
                Cooking classes, nutrition workshops, and themed dining nights — I-tal Garden as gathering
                place, not just kitchen.
              </p>
              <Button href="/events" variant="outline" className="mt-6 self-start">
                See What&rsquo;s On
              </Button>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Location */}
      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Visit Us</Eyebrow>
            <SectionHeading>
              St. Claude Ave, <span className="italic text-gold">Treme</span>.
            </SectionHeading>
            <address className="mt-6 not-italic font-body text-lg leading-relaxed text-cream/90">
              {CONTACT.addressLine1}
              <br />
              {CONTACT.addressLine2}
            </address>
            <p className="mt-4 font-body text-mist">{HOURS_SUMMARY}</p>
            <p className="mt-1 font-body text-mist">{CONTACT.phone}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={CONTACT.mapsUrl} external>
                Get Directions
              </Button>
              <Button href="/contact" variant="outline">
                Full Contact Info
              </Button>
            </div>
          </div>
          <PhotoSlot label="Storefront / dining room" aspect="aspect-[4/3]" />
        </div>
      </Section>
    </>
  );
}
