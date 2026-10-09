// Copy for each channel's output panel on the homepage console.
interface Output {
  title: string;
  body?: string;
  rows?: [string, string][];
  cta?: { label: string; href: string };
}

export const OUTPUTS: Record<"music" | "business" | "work" | "vault" | "vaultLocked", Output> = {
  music: {
    title: "29 credits across production and engineering",
    body: "Producer and engineer for Curren$y, Quando Rondo and NoCap, production for Boosie Badazz and records featuring Wiz Khalifa, and a Grammy participation award for work on Killer Mike's MICHAEL, Best Rap Album 2024.",
    rows: [
      ["Curren$y", "Producer / Engineer"],
      ["Killer Mike — MICHAEL", "Grammy participation"],
      ["Wiz Khalifa", "Production"],
      ["Quando Rondo · NoCap · Boosie", "Production"],
    ],
    cta: { label: "Full credits", href: "/music" },
  },
  business: {
    title: "Websites, campaigns and AI tools",
    body: "Production websites, social media marketing with the site built in, and AI tools for contractors. Half down starts any project.",
    rows: [
      ["Website", "$3,000"],
      ["Social media marketing + website", "$5,000"],
      ["AI for contractors", "Custom quote"],
      ["Website starter kit", "$50"],
    ],
    cta: { label: "See packages", href: "/business" },
  },
  work: {
    title: "Recent builds",
    rows: [
      ["Mid City Sound Studios", "Studio + booking"],
      ["Epoch Skin", "Brand + store"],
      ["Jade the Gem", "DJ site + booking"],
      ["Flu-Haul", "Service site"],
      ["Bourbon Daiquiris", "Restaurant site"],
    ],
    cta: { label: "All work", href: "/portfolio" },
  },
  vault: {
    title: "The sample is in",
    body: "You cracked the console. Unreleased sessions and private work live one door further in, by invitation.",
    cta: { label: "Enter the vault", href: "/vault" },
  },
  vaultLocked: {
    title: "This channel is locked",
    body: "Something is missing from the mix. Turn the three vault dials to the right combination to bring it in. Drag a dial up or down to change it.",
  },
};
