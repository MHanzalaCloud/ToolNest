import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08090D",
        surface: "#0F1117",
        "surface-elevated": "#161922",
        brand: {
          DEFAULT: "#FF5500",
          hover: "#E04B00",
          glow: "rgba(255, 85, 0, 0.25)",
        },
        border: "rgba(255, 255, 255, 0.08)",
      },
      backgroundImage: {
        'topo-pattern': "radial-gradient(circle at 50% 0%, rgba(255, 85, 0, 0.08) 0%, transparent 50%), repeating-radial-gradient(circle at 50% 0%, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;