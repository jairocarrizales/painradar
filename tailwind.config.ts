import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Source-badge background colors are applied dynamically (bg-${tone}).
  safelist: [
    "bg-brand",
    "bg-pop-pink",
    "bg-pop-cyan",
    "bg-pop-lime",
    "bg-pop-violet",
    "bg-pop-orange",
    "bg-pop-red",
  ],
  theme: {
    extend: {
      colors: {
        // Neobrutalism saturated palette
        ink: "#0A0A0A",
        paper: "#FAF7F0",
        brand: {
          DEFAULT: "#FFDB3D", // signature yellow
          dark: "#E6C200",
        },
        pop: {
          pink: "#FF6B9D",
          cyan: "#3DDCFF",
          lime: "#B8FF3D",
          violet: "#B388FF",
          orange: "#FF8A3D",
          red: "#FF4D4D",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderWidth: {
        3: "3px",
        5: "5px",
      },
      boxShadow: {
        // Hard offset shadows (no blur) — the neobrutalism signature
        "brutal-sm": "2px 2px 0 0 #0A0A0A",
        brutal: "4px 4px 0 0 #0A0A0A",
        "brutal-md": "6px 6px 0 0 #0A0A0A",
        "brutal-lg": "8px 8px 0 0 #0A0A0A",
        "brutal-xl": "12px 12px 0 0 #0A0A0A",
      },
      borderRadius: {
        brutal: "6px",
      },
      keyframes: {
        "fill-bar": {
          from: { width: "0%" },
          to: { width: "var(--bar-width)" },
        },
      },
      animation: {
        "fill-bar": "fill-bar 0.8s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
