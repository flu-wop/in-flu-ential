// Copy for each channel's output panel on the homepage console.
interface Output {
  title: string;
  body?: string;
  rows?: [string, string][];
  cta?: { label: string; href: string };
}

export const OUTPUTS: Record<"music" | "business" | "work" | "vault" | "vaultLocked", Output> = {
  music: {
    title: "29 Credits Across Production and Engineering",
    body: "Producer and engineer for Curren$y, Quando Rondo and NoCap, production for Boosie Badazz and records featuring Wiz Khalifa, and a Grammy participation award for work on Killer Mike's MICHAEL, Best Rap Album 2024.",
    rows: [
      ["Curren$y", "Producer / Engineer"],
      ["Killer Mike — MICHAEL", "Grammy Participation"],
      ["Wiz Khalifa", "Production"],
      ["Quando Rondo · NoCap · Boosie", "Production"],
    ],
    cta: { label: "Full Credits", href: "/music" },
  },
  business: {
    title: "Websites, Campaigns and AI Tools",
    body: "Production websites, social media marketing with the site built in, and AI tools for contractors. Half down starts any project.",
    rows: [
      ["Website", "$3,000"],
      ["Social Media Marketing + Website", "$5,000"],
      ["AI for Contractors", "Custom quote"],
      ["Website Starter Kit", "$50"],
    ],
    cta: { label: "See Packages", href: "/business" },
  },
  work: {
    title: "Recent Builds",
    rows: [
      ["Mid City Sound Studios", "Studio + Booking"],
      ["Epoch Skin", "Brand + Store"],
      ["Jade the Gem", "DJ Site + Booking"],
      ["Flu-Haul", "Service Site"],
      ["Bourbon Daiquiris", "Restaurant Site"],
    ],
    cta: { label: "All Work", href: "/portfolio" },
  },
  vault: {
    title: "The Sample is in",
    body: "You cracked the console. Unreleased sessions and private work live one door further in, by invitation.",
    cta: { label: "Enter the Vault", href: "/vault" },
  },
  vaultLocked: {
    title: "This Channel is Locked",
    body: "Something is missing from the mix. Turn the three vault dials to the right combination to bring it in. Drag a dial up or down to change it.",
  },
};
