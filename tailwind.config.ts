import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bis: {
          navy: "#0F2540",
          "navy-light": "#163860",
          "navy-dark": "#09182A",
          "navy-muted": "#2B4C7E",
          blue: "#1A4D8F",
          "blue-light": "#2563EB",
          "blue-soft": "#EFF6FF",
          saffron: "#E85D04",
          "saffron-light": "#F48C06",
          "saffron-soft": "#FFF7ED",
          "saffron-dark": "#DC2F02",
          canvas: "#F9FAFB",
          surface: "#FFFFFF",
          "surface-muted": "#F3F4F6",
          border: "#E5E7EB",
          "border-strong": "#D1D5DB",
          "text-primary": "#111827",
          "text-secondary": "#4B5563",
          "text-muted": "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-space-grotesk)", "var(--font-inter)", "sans-serif"],
        devanagari: ["var(--font-noto-devanagari)", "system-ui", "sans-serif"],
        tamil: ["var(--font-noto-tamil)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        dropdown: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        modal: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "glow-saffron": "0 0 15px -3px rgba(232, 93, 4, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
