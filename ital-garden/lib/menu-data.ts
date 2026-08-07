// Menu copy is drawn from I-tal Garden's public listings (their own site,
// Google, and delivery-platform menus). It is NOT the full, current,
// priced menu — pricing changes and the kitchen runs seasonal specials, so
// prices are intentionally left off here. Confirm the live lineup + prices
// against the SpotHopper ordering page before this goes live, and swap this
// file for the real thing when Chef Ra sends it over.

export type MenuItem = {
  name: string;
  description: string;
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
      },
      {
        name: "Chickpea Scramble & Grits",
        description: "Creamy stone-ground grits alongside a turmeric chickpea scramble standing in for eggs.",
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
      },
      {
        name: "Cajun Pasta",
        description: "Penne tossed in a spiced Cajun cream sauce, built entirely plant-based.",
      },
      {
        name: "I-tal Plate",
        description: "Coconut curry black-eyed peas served the ital way — whole, seasoned, and slow-simmered.",
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
      },
      {
        name: "Cauliflower Wings",
        description: "Battered and tossed cauliflower, wing-style, with a sauce that brings the heat.",
      },
      {
        name: "Jackfruit Ribs",
        description: "Pulled and glazed jackfruit doing its best barbecue-rib impression, and winning.",
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
