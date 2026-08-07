import type { Metadata } from "next";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { LINKS, SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind I-tal Garden: Chef Ra's family-owned, fully plant-based take on New Orleans soul food, rooted in the ital philosophy of eating close to the earth.",
  alternates: { canonical: "/about" },
  openGraph: { title: `About — ${SITE.name}`, url: "/about" },
};

export default function AboutPage() {
  return (
    <>
      {/*
        TODO(James): this page runs on the philosophy/mission language we could
        confirm publicly. Chef Ra's personal bio (background, how the
        restaurant started, family details) should come straight from him —
        swap in real specifics here rather than leaving it general.
      */}
      <Section className="pb-10 pt-16 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Our Story</Eyebrow>
            <SectionHeading>
              Cooking is Chef Ra&rsquo;s <span className="italic text-gold">ministry</span>.
            </SectionHeading>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-mist">
              I-tal Garden is family-owned and operated, built on a simple belief: plant-based food can hold
              every bit of the flavor and history that New Orleans soul food is known for.
            </p>
          </div>
          <PhotoSlot label="Chef Ra portrait" aspect="aspect-[4/5]" />
        </div>
      </Section>

      <Section className="border-y border-border/60 bg-charcoal/60">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>The Philosophy</Eyebrow>
          <SectionHeading>
            Eating <span className="italic text-turmeric">ital</span>
          </SectionHeading>
          <p className="mt-6 font-body text-base leading-relaxed text-mist">
            &ldquo;Ital&rdquo; — rooted in the Rastafari tradition, from &ldquo;vital&rdquo; — means food kept close to
            its natural state: organic, minimally processed, prepared with intention. At I-tal Garden, that
            philosophy meets Creole technique. Ancient ingredients, slow method, balanced plates — flavorful
            first, so that healthy never feels like a compromise.
          </p>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <PhotoSlot label="Kitchen / prep, hands-on cooking" aspect="aspect-[4/3]" />
          <div>
            <Eyebrow>New Orleans, Through and Through</Eyebrow>
            <SectionHeading>
              Soul food didn&rsquo;t need <span className="italic text-gold">meat</span> to be soul.
            </SectionHeading>
            <p className="mt-6 font-body text-base leading-relaxed text-mist">
              Jackfruit stands in for pulled pork. Hearts of palm become crab cakes. Coconut milk carries a
              gumbo base. Every substitution on this menu is a technique, not a shortcut — built so the dish
              tastes like the New Orleans original, not an apology for it.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/menu" variant="outline">
                See the Menu
              </Button>
              <Button href={LINKS.order} external>
                Order Online
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
