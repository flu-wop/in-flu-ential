// Menu copy is drawn from I-tal Garden's public listings (their own site,
// Google, and delivery-platform menus), cross-checked against real dish
// photos James sent over. It is NOT the full, current, priced menu —
// pricing changes and the kitchen runs seasonal specials. Confirm the live
// lineup + prices against the SpotHopper ordering page before this goes
// live, and swap this file for the real thing when Chef Ra sends it over.
//
// Kale Salad, Ital Salad, and Kickin' Strips were added from photo evidence
// (not the original scraped text) — names are our best read of the dish,
// worth confirming against the real menu.
//
// Pricing: only 4 prices could be confirmed (matched exactly against an
// aggregator listing's description text) — Ra Pasta, I-tal Plate, Jackfruit
// Ribs, Crabless Crab Cakes. Everything else is `price: null` ("TBD" in the
// UI) rather than a guessed number — other aggregator figures we found
// contradicted each other, so nothing unverified made it in. Replace with
// real numbers from a SpotHopper screenshot when available.

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  image?: string;
  /** Dollars, or null if not yet confirmed ("Price TBD" in the UI). */
  price: number | null;
};

export type MenuSection = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

export const MENU: MenuSection[] = [
  {
    id: "brunch",
    title: "Brunch",
    note: "Served during regular hours",
    items: [
      {
        id: "pancakes",
        name: "Pancakes",
        description: "Stacked and griddled, made without a single egg or drop of dairy.",
        image: "/images/menu/pancakes.jpg",
        price: null,
      },
      {
        id: "grits-scramble",
        name: "Chickpea Scramble & Grits",
        description: "Creamy stone-ground grits alongside a turmeric chickpea scramble standing in for eggs.",
        image: "/images/menu/grits-scramble.jpg",
        price: null,
      },
    ],
  },
  {
    id: "mains",
    title: "Plates",
    items: [
      {
        id: "ra-pasta",
        name: "The Ra Pasta",
        description: "Smoked jackfruit and grilled vegetables bathed in coconut milk over penne, finished with crispy oyster mushrooms.",
        image: "/images/menu/ra-pasta.jpg",
        price: 16,
      },
      {
        id: "cajun-pasta",
        name: "Cajun Pasta",
        description: "Penne tossed in a spiced Cajun cream sauce, built entirely plant-based.",
        price: null,
      },
      {
        id: "ital-plate",
        name: "I-tal Plate",
        description: "Coconut curry black-eyed peas served the ital way — whole, seasoned, and slow-simmered.",
        image: "/images/menu/ital-plate.jpg",
        price: 10,
      },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    items: [
      {
        id: "kale-salad",
        name: "Kale Salad",
        description: "Kale, quinoa, cucumber, tomato, avocado, and sprouts, topped with crispy fried oyster mushrooms.",
        image: "/images/menu/kale-salad.jpg",
        price: null,
      },
      {
        id: "ital-salad",
        name: "Ital Salad",
        description: "Mixed greens, quinoa, avocado, cucumber, tomato, and sprouts, dressed light.",
        image: "/images/menu/ital-salad.jpg",
        price: null,
      },
    ],
  },
  {
    id: "starters",
    title: "Small Plates",
    items: [
      {
        id: "crabless-cakes",
        name: "Crabless Crab Cakes",
        description: "Hearts of palm and jackfruit, seasoned and seared to order — no shellfish, all the flavor.",
        image: "/images/menu/crabless-cakes.jpg",
        price: 12,
      },
      {
        id: "cauliflower-wings",
        name: "Cauliflower Wings",
        description: "Battered and tossed cauliflower, wing-style, with a sauce that brings the heat.",
        image: "/images/menu/cauliflower-wings.jpg",
        price: null,
      },
      {
        id: "jackfruit-ribs",
        name: "Jackfruit Ribs",
        description: "Pulled and glazed jackfruit doing its best barbecue-rib impression, and winning.",
        image: "/images/menu/jackfruit-ribs.jpg",
        price: 10,
      },
      {
        id: "kickin-strips",
        name: "Kickin' Strips",
        description: "Breaded and fried, served with a dip that brings the kick.",
        image: "/images/menu/kickin-strips.jpg",
        price: null,
      },
      {
        id: "oyster-bites",
        name: "Oyster Mushroom Bites",
        description: "Crispy-fried oyster mushrooms, a Chef Ra signature texture play.",
        price: null,
      },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      {
        id: "mac-and-cheese",
        name: "Mac and Cheese",
        description: "Vegan, baked, and built to convert the skeptics.",
        price: null,
      },
      {
        id: "creole-greens",
        name: "Creole Greens",
        description: "Slow-cooked greens, seasoned the New Orleans way — no smoked meat required.",
        price: null,
      },
      {
        id: "cornbread",
        name: "Cornbread",
        description: "Skillet-style, on the side of everything.",
        price: null,
      },
    ],
  },
];

export const ALL_ITEMS = MENU.flatMap((section) => section.items);
