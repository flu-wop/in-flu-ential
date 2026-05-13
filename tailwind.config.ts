import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        "ink-2": "#141414",
        "ink-3": "#1E1E1E",
        gold: "#C9A84C",
        "gold-light": "#E2C47A",
        "gold-dim": "#8A6E30",
        cream: "#F5F0E8",
        "cream-dim": "#D4CFC6",
        mist: "#9A9A9A",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
        widest3: "0.4em",
      },
    },
  },
  plugins: [],
};
export default config;
