import type { Metadata } from "next";
import Image from "next/image";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Button } from "@/components/ui/Button";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { LINKS, SITE } from "@/lib/site-config";
import { MENU } from "@/lib/menu-data";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Plant-based Creole and soul food from Chef Ra: The Ra Pasta, jackfruit ribs, crabless crab cakes, vegan mac and cheese, and more. Order online for pickup.",
  alternates: { canonical: "/menu" },
  openGraph: { title: `Menu — ${SITE.name}`, url: "/menu" },
};

export default function MenuPage() {
  return (
    <>
      <Section className="pb-10 pt-16 md:pt-20">
        <Eyebrow>Fully Plant-Based</Eyebrow>
        <SectionHeading>
          The <span className="italic text-gold">Menu</span>
        </SectionHeading>
        <p className="mt-6 max-w-xl font-body text-base leading-relaxed text-mist">
          Every dish on this menu is built without meat, dairy, or eggs — seasoned and cooked the way New
          Orleans soul food always has been. The kitchen runs seasonal specials, so ask what&rsquo;s fresh.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href={LINKS.order} external>
            Order Online
          </Button>
        </div>
        <p className="mt-3 text-sm text-mist">
          Current pricing and daily availability are on our ordering partner&rsquo;s site.
        </p>
      </Section>

      {MENU.map((section, i) => (
        <Section key={section.id} className={i % 2 === 1 ? "bg-charcoal/60" : ""}>
          <div className="mb-10 flex items-baseline justify-between gap-4">
            <h2 className="font-display text-3xl text-cream">{section.title}</h2>
            {section.note && <span className="font-mono text-xs uppercase tracking-widest text-turmeric">{section.note}</span>}
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            {section.items.map((item) => (
              <div key={item.id} className="flex gap-5 border-b border-border/60 pb-8">
                {item.image ? (
                  <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-2xl border border-border">
                    <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                  </div>
                ) : (
                  <PhotoSlot label={item.name} aspect="aspect-square" className="w-28 shrink-0" />
                )}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl text-cream">{item.name}</h3>
                    <span className="shrink-0 font-mono text-sm text-turmeric">
                      {item.price !== null ? `$${item.price.toFixed(2)}` : "TBD"}
                    </span>
                  </div>
                  <p className="mt-2 font-body text-sm leading-relaxed text-mist">{item.description}</p>
                  <div className="mt-3">
                    <AddToCartButton id={item.id} name={item.name} price={item.price} image={item.image} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <Section className="text-center">
        <SectionHeading>
          Ready to <span className="italic text-gold">eat</span>?
        </SectionHeading>
        <p className="mx-auto mt-4 max-w-md font-body text-mist">
          Order ahead for pickup at St. Claude Ave, Wednesday through Friday.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href={LINKS.order} external>
            Order Online
          </Button>
          <Button href="/catering" variant="outline">
            Feeding a Group? See Catering
          </Button>
        </div>
      </Section>
    </>
  );
}
