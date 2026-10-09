// Every site build shown on Work. Set hidden: true to keep an entry out of
// the public list without losing it. Screenshots live in /public/work as
// 960x600 .webp files named after `shot`.

export interface Site {
  name: string;
  url: string;
  shot: string; // /public/work/<shot>.webp
  blurb: string;
  built: string[];
  hidden?: boolean;
}

export const ALL_CATEGORIES: { title: string; sites: Site[] }[] = [
  {
    title: "Artists and Music",
    sites: [
      { name: "Graham Hill", url: "https://graham-hill.vercel.app", shot: "graham-hill", blurb: "Campaign site for the Beach House drummer's debut album, Taking In Stars.", built: ["Album Campaign", "Sync Licensing", "Press"] },
      { name: "Donald Markowitz", url: "https://www.donaldmarkowitz.com", shot: "donald-markowitz", blurb: "Artist site for the Academy Award-winning composer and producer.", built: ["Credits", "Catalog", "Merch"] },
      { hidden: true, name: "Tyron Benoit Band", url: "https://tyron-benoit.vercel.app", shot: "tyron-benoit", blurb: "Song campaign site for “Hope You Find Heaven.”", built: ["Song Campaign", "Press Kit"] },
      { hidden: true, name: "Doug Belote", url: "https://dougbelote.vercel.app", shot: "doug-belote", blurb: "Site for the New Orleans drummer and percussionist.", built: ["Credits", "Media", "Booking"] },
      { name: "DJ Jade the Gem", url: "https://www.dahiddengem.com", shot: "jade-the-gem", blurb: "DJ site with mixes, events and direct booking.", built: ["Booking", "Mixes", "Events"] },
      { hidden: true, name: "Lil Squiggle", url: "https://lilsquiggle.vercel.app", shot: "lil-squiggle", blurb: "Release site for “Don't Drink & Dial,” with a merch shop.", built: ["Release Site", "Shop"] },
      { name: "Street Beat", url: "https://www.streetbeat.video", shot: "streetbeat", blurb: "Documentary site with a paid streaming paywall.", built: ["Paywall", "Stripe", "Trailer"] },
    ],
  },
  {
    title: "Studios and Production",
    sites: [
      { name: "Mid City Sound Studios", url: "https://www.midcitysound.com", shot: "mid-city-sound", blurb: "Recording studio site with session booking and Stripe checkout.", built: ["Booking", "Stripe", "Calendar Invites"] },
      { name: "Fire on the Bayou", url: "https://fireonthebayou.vercel.app", shot: "fire-on-the-bayou", blurb: "Video production house making commercials and brand films in New Orleans.", built: ["Showreel", "Portfolio"] },
      { hidden: true, name: "Breaks In The Simulation", url: "https://bits-weld.vercel.app", shot: "bits", blurb: "Artist wellness and creative services organization.", built: ["Programs", "Events"] },
    ],
  },
  {
    title: "Beauty and Retail",
    sites: [
      { name: "Epoch Skin", url: "https://epoch-skin.com", shot: "epoch-skin", blurb: "Waxing studio and organic skincare brand.", built: ["Booking", "Store", "Automated Newsletter"] },
      { name: "Liquid Gold Skin Co.", url: "https://www.liquidgoldskinco.com", shot: "liquid-gold", blurb: "Island-inspired body care store.", built: ["Store", "Square Checkout", "Admin Panel"] },
      { name: "EGOFF Essentials", url: "https://www.egoffessentials.com", shot: "egoff", blurb: "Luxury handcrafted natural soap brand.", built: ["Brand Site", "Checkout"] },
      { hidden: true, name: "Akua Method", url: "https://akua-method.vercel.app", shot: "akua-method", blurb: "Luxury perfume oils inspired by Ghanaian heritage.", built: ["Store", "Brand Story"] },
      { name: "MVC Creations", url: "https://mvc-creations.vercel.app", shot: "mvc-creations", blurb: "Nail artist in Kenner, with chair booking.", built: ["Booking", "Gallery"] },
    ],
  },
  {
    title: "Local Business",
    sites: [
      { name: "Bourbon Daiquiris Wings & Things", url: "https://bourbondaiquiris.vercel.app", shot: "bourbon-daiquiris", blurb: "Westbank daiquiri and wings spot with a build-your-cup menu.", built: ["Menu Builder", "Ordering"] },
      { name: "Flu-Haul", url: "https://www.fluhaul.com", shot: "flu-haul", blurb: "Junk removal company with instant quotes and booking.", built: ["Quotes", "Booking", "Stripe"] },
      { name: "A&B Supply & Surplus", url: "https://www.absupply.us", shot: "ab-supply", blurb: "Industrial surplus and heavy equipment parts store.", built: ["Store", "Stripe"] },
      { hidden: true, name: "Once In A Room", url: "https://once-in-a-room.vercel.app", shot: "once-in-a-room", blurb: "Interior design consultations, booked online.", built: ["Booking", "Portfolio"] },
    ],
  },
];


// What the site shows: hidden entries removed, empty categories dropped.
export const CATEGORIES = ALL_CATEGORIES.map((c) => ({ ...c, sites: c.sites.filter((s) => !s.hidden) })).filter(
  (c) => c.sites.length > 0
);

export const SITE_COUNT = CATEGORIES.reduce((n, c) => n + c.sites.length, 0);
