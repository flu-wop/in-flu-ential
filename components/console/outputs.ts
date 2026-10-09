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
    body: "Producer and engineer for Curren$y, Quando Rondo and NoCap, production for Boosie Badazz and records featuring Wiz Khalifa, and an engineering credit on Killer Mike's MICHAEL.",
    rows: [
      ["Curren$y", "Producer / Engineer"],
      ["Killer Mike — MICHAEL", "Engineering"],
      ["Trapaganda", "Jet Life / EMPIRE"],
      ["Quando Rondo · NoCap · Boosie", "Production"],
    ],
    cta: { label: "Full credits", href: "/music" },
  },
  business: {
    title: "Creative strategy with an engineer's ear",
    body: "Cinematic websites, campaigns and brand systems for artists and businesses that want to be remembered.",
    rows: [
      ["Growth", "$10,000"],
      ["Influence", "$25,000"],
      ["Legacy", "$50,000+"],
    ],
    cta: { label: "See engagements", href: "/business" },
  },
  work: {
    title: "Recent sessions",
    rows: [
      ["Mid City Sound Studios", "Studio + booking"],
      ["Epoch Skin", "Brand + store"],
      ["Graham Hill", "Album campaign"],
      ["Flu-Haul", "Service site"],
      ["Professor Longhair Documentary", "Investor pitch"],
    ],
    cta: { label: "All work", href: "/portfolio" },
  },
  vault: {
    title: "The sample is in",
    body: "You cracked the console. Pitch decks, unreleased sessions and private work live one door further in, by invitation.",
    cta: { label: "Enter the vault", href: "/vault" },
  },
  vaultLocked: {
    title: "This channel is locked",
    body: "Something is missing from the mix. Turn the three vault dials to the right combination to bring it in. Drag a dial up or down to change it.",
  },
};
