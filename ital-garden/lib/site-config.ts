// Single source of truth for name/address/phone/hours and every external link.
// Every page must import from here — never hardcode the address, phone, or
// hours inline, so the whole site (and every linked listing) stays in sync.

export const SITE = {
  name: "I-tal Garden",
  shortName: "I-tal Garden",
  domain: "italgardennola.com",
  tagline: "Plant-based soul food, New Orleans",
  description:
    "I-tal Garden is a family-owned, fully plant-based soul food kitchen in New Orleans' Treme/7th Ward, serving Chef Ra's organic, ital-inspired take on Creole and soul food classics.",
};

export const CONTACT = {
  addressLine1: "2372 St. Claude Ave, Suite 130",
  addressLine2: "New Orleans, LA 70116",
  city: "New Orleans",
  state: "LA",
  zip: "70116",
  fullAddress: "2372 St. Claude Ave, Suite 130, New Orleans, LA 70116",
  phone: "(504) 515-7321",
  phoneHref: "tel:+15045157321",
  email: "italgardennola@gmail.com",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=2372+St.+Claude+Ave+Suite+130+New+Orleans+LA+70116",
  mapsEmbedSrc:
    "https://maps.google.com/maps?q=2372+St+Claude+Ave+Suite+130+New+Orleans+LA+70116&t=&z=15&ie=UTF8&iwloc=&output=embed",
};

// PENDING: confirmed against public aggregator listings (Google/Yelp/website
// summaries) but not the primary source directly — verify against the
// SpotHopper dashboard / current posted hours before launch.
export const HOURS: { day: string; hours: string }[] = [
  { day: "Monday", hours: "Closed" },
  { day: "Tuesday", hours: "Closed" },
  { day: "Wednesday", hours: "11:00 AM – 3:00 PM" },
  { day: "Thursday", hours: "11:00 AM – 3:00 PM" },
  { day: "Friday", hours: "11:00 AM – 3:00 PM" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" },
];

export const HOURS_SUMMARY = "Wed – Fri, 11:00 AM – 3:00 PM";

// Same hours, in schema.org's expected 24-hour HH:MM format, for JSON-LD.
export const HOURS_SCHEMA: { day: string; opens: string; closes: string }[] = [
  { day: "Wednesday", opens: "11:00", closes: "15:00" },
  { day: "Thursday", opens: "11:00", closes: "15:00" },
  { day: "Friday", opens: "11:00", closes: "15:00" },
];

export const SOCIAL = {
  instagram: "https://www.instagram.com/italgardennola/",
  instagramHandle: "@italgardennola",
  facebook: "https://www.facebook.com/ItalGardennola/",
};

// TODO(James): swap in the real tmt.spotapps.co URLs (with I-tal Garden's
// spot_id) for each of these — I couldn't reach spotapps.co or
// italgardennola.com through the network sandbox to pull the real links, so
// these are placeholders pointing at the SpotHopper root only.
export const LINKS = {
  order: "https://tmt.spotapps.co/",
  reserve: "https://tmt.spotapps.co/",
  cateringOrder: "https://tmt.spotapps.co/private-parties",
  jobs: "https://tmt.spotapps.co/",
  mealPrep: "https://italmealprep.com/",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/meal-prep", label: "Meal Prep" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
