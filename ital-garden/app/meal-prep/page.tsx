import type { Metadata } from "next";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { MealPrepVignette } from "@/components/vignettes/MealPrepVignette";
import { LINKS, SITE } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Meal Prep",
  description:
    "I-tal Meal Prep is Chef Ra's plant-based meal prep service — order a week of ital eating for pickup, from the team behind I-tal Garden.",
  alternates: { canonical: "/meal-prep" },
  openGraph: { title: `Meal Prep — ${SITE.name}`, url: "/meal-prep" },
};

const STEPS = [
  { step: "01", title: "Choose your week", description: "Pick your plates for the week from the current I-tal Meal Prep menu." },
  { step: "02", title: "We cook it fresh", description: "Same ital standard as the restaurant — no shortcuts for the prep menu." },
  { step: "03", title: "Pick up & reheat", description: "Grab your order and you're set for the week — heat and eat." },
];

export default function MealPrepPage() {
  return (
    <>
      <Section className="pb-10 pt-16 md:pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <Eyebrow>Sister Service · Separate Site</Eyebrow>
            <SectionHeading>
              Ital eating, <span className="italic text-turmeric">delivered</span>.
            </SectionHeading>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-mist">
              I-tal Meal Prep is Chef Ra&rsquo;s plant-based meal prep line — built for the week, not just the
              visit. Same kitchen philosophy as I-tal Garden, packaged to take home.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={LINKS.mealPrep} external>
                Order on italmealprep.com
              </Button>
            </div>
            <p className="mt-3 text-sm text-mist">
              Meal Prep has its own menu and ordering — this page just points you there.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <MealPrepVignette />
          </div>
        </div>
      </Section>

      <Section className="border-t border-border/60 bg-charcoal/60">
        <Eyebrow>How It Works</Eyebrow>
        <SectionHeading className="mb-12">
          Three steps to a <span className="italic text-gold">stocked fridge</span>
        </SectionHeading>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.step}>
              <span className="font-mono text-sm text-turmeric">{s.step}</span>
              <h3 className="mt-2 font-display text-xl text-cream">{s.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-mist">{s.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 md:grid-cols-2">
          <PhotoSlot label="Meal prep containers, plated" aspect="aspect-[4/3]" />
          <div>
            <Eyebrow>Same Kitchen, Different Rhythm</Eyebrow>
            <SectionHeading>
              For when you can&rsquo;t make it to <span className="italic text-gold">St. Claude</span>
            </SectionHeading>
            <p className="mt-6 font-body text-base leading-relaxed text-mist">
              Dine in with us Wednesday through Friday, or stock up for the whole week through I-tal Meal
              Prep — either way, it&rsquo;s Chef Ra&rsquo;s food.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href={LINKS.mealPrep} external>
                Visit I-tal Meal Prep
              </Button>
              <Button href="/menu" variant="outline">
                See the Restaurant Menu
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
