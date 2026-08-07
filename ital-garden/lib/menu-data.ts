// Menu copy is drawn from I-tal Garden's public listings (their own site,
// Google, and delivery-platform menus), cross-checked against real dish
// photos James sent over. It is NOT the full, current, priced menu —
// pricing changes and the kitchen runs seasonal specials, so prices are
// intentionally left off here. Confirm the live lineup + prices against the
// SpotHopper ordering page before this goes live, and swap this file for
// the real thing when Chef Ra sends it over.
//
// Kale Salad, Ital Salad, and Kickin' Strips were added from photo evidence
// (not the original scraped text) — names are our best read of the dish,
// worth confirming against the real menu.

export type MenuItem = {
  name: string;
  description: string;
  image?: string;
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
        name: "Pancakes",
        description: "Stacked and griddled, made without a single egg or drop of dairy.",
        image: "/images/menu/pancakes.jpg",
      },
      {
        name: "Chickpea Scramble & Grits",
        description: "Creamy stone-ground grits alongside a turmeric chickpea scramble standing in for eggs.",
        image: "/images/menu/grits-scramble.jpg",
      },
    ],
  },
  {
    id: "mains",
    title: "Plates",
    items: [
      {
        name: "The Ra Pasta",
        description: "Smoked jackfruit and grilled vegetables bathed in coconut milk over penne, finished with crispy oyster mushrooms.",
        image: "/images/menu/ra-pasta.jpg",
      },
      {
        name: "Cajun Pasta",
        description: "Penne tossed in a spiced Cajun cream sauce, built entirely plant-based.",
      },
      {
        name: "I-tal Plate",
        description: "Coconut curry black-eyed peas served the ital way — whole, seasoned, and slow-simmered.",
        image: "/images/menu/ital-plate.jpg",
      },
    ],
  },
  {
    id: "salads",
    title: "Salads",
    items: [
      {
        name: "Kale Salad",
        description: "Kale, quinoa, cucumber, tomato, avocado, and sprouts, topped with crispy fried oyster mushrooms.",
        image: "/images/menu/kale-salad.jpg",
      },
      {
        name: "Ital Salad",
        description: "Mixed greens, quinoa, avocado, cucumber, tomato, and sprouts, dressed light.",
        image: "/images/menu/ital-salad.jpg",
      },
    ],
  },
  {
    id: "starters",
    title: "Small Plates",
    items: [
      {
        name: "Crabless Crab Cakes",
        description: "Hearts of palm and jackfruit, seasoned and seared to order — no shellfish, all the flavor.",
        image: "/images/menu/crabless-cakes.jpg",
      },
      {
        name: "Cauliflower Wings",
        description: "Battered and tossed cauliflower, wing-style, with a sauce that brings the heat.",
        image: "/images/menu/cauliflower-wings.jpg",
      },
      {
        name: "Jackfruit Ribs",
        description: "Pulled and glazed jackfruit doing its best barbecue-rib impression, and winning.",
        image: "/images/menu/jackfruit-ribs.jpg",
      },
      {
        name: "Kickin' Strips",
        description: "Breaded and fried, served with a dip that brings the kick.",
        image: "/images/menu/kickin-strips.jpg",
      },
      {
        name: "Oyster Mushroom Bites",
        description: "Crispy-fried oyster mushrooms, a Chef Ra signature texture play.",
      },
    ],
  },
  {
    id: "sides",
    title: "Sides",
    items: [
      {
        name: "Mac and Cheese",
        description: "Vegan, baked, and built to convert the skeptics.",
      },
      {
        name: "Creole Greens",
        description: "Slow-cooked greens, seasoned the New Orleans way — no smoked meat required.",
      },
      {
        name: "Cornbread",
        description: "Skillet-style, on the side of everything.",
      },
    ],
  },
];
