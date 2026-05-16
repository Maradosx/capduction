import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Mix 1 — Soft Liquid Console — Iridescent Pastel ───
        lav:     "#E8DEFF",
        peach:   "#FFE0D0",
        mint:    "#D6F5E5",
        sky:     "#D5E8FF",
        rose:    "#FFD0E0",
        gold:    "#FFE5A0",
        pink:    "#FF8FB5",
        violet:  "#B58FFF",
        teal:    "#5DD5DA",
        ink: {
          DEFAULT: "#2A2348",
          2: "#3D3464",
          3: "#5C548A",
        },
        slate: {
          DEFAULT: "#8A82B0",
          2: "#6B6585",
        },
        paper: {
          DEFAULT: "#FCFAFF",
          2: "#F7F2FF",
        },
      },
      fontFamily: {
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif:   ["'Instrument Serif'", "ui-serif", "Georgia", "serif"],
        thai:    ["Sarabun", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["'Geist Mono'", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "gradient-iridescent":
          "linear-gradient(135deg, #FF8FB5 0%, #B58FFF 45%, #5DD5DA 100%)",
        "gradient-chrome":
          "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), #E8DEFF 15%, #FFD0E0 35%, #B58FFF 60%, #5C548A 100%)",
        "mesh-soft":
          "radial-gradient(circle at 10% 18%, #E8DEFF 0%, transparent 40%), radial-gradient(circle at 85% 12%, #FFE0D0 0%, transparent 38%), radial-gradient(circle at 75% 78%, #D6F5E5 0%, transparent 45%), radial-gradient(circle at 15% 82%, #D5E8FF 0%, transparent 42%), radial-gradient(circle at 50% 50%, #FFD0E0 0%, transparent 50%)",
      },
      boxShadow: {
        glass:
          "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(168,155,213,0.2) inset, 0 12px 32px rgba(94,79,138,0.12)",
        "glass-lg":
          "0 1px 0 rgba(255,255,255,0.95) inset, 0 -1px 0 rgba(168,155,213,0.2) inset, 0 50px 100px rgba(94,79,138,0.25), 0 0 80px rgba(181,143,255,0.15)",
        orb:
          "0 0 0 1px rgba(255,255,255,0.7), 0 4px 14px rgba(181,143,255,0.4), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -2px 4px rgba(94,79,138,0.3)",
        "btn-grad":
          "0 1px 0 rgba(255,255,255,0.4) inset, 0 -1px 0 rgba(94,79,138,0.3) inset, 0 4px 14px rgba(181,143,255,0.5)",
        "btn-grad-hover":
          "0 1px 0 rgba(255,255,255,0.4) inset, 0 -1px 0 rgba(94,79,138,0.3) inset, 0 8px 24px rgba(181,143,255,0.6)",
      },
      backdropBlur: {
        glass: "18px",
        "glass-lg": "28px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.5", transform: "scale(0.85)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.4" },
        },
        rise: {
          "0%":   { transform: "translateY(110%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        float:   "float 4s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        pulse:   "pulse 2s ease-in-out infinite",
        rise:    "rise 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
      transitionTimingFunction: {
        sleek: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
