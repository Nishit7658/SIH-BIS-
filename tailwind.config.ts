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
        // Authoritative Institutional Palette (per Design Master Rules)
        gov: {
          navy: "#0A192F",          // Statutory deep navy
          "navy-light": "#1E293B",  // Slate navy
          "navy-dark": "#050C17",   // Midnight obsidian
          slate: "#334155",         // Engineering slate
          "slate-light": "#64748B",  // Secondary text
          saffron: "#B45309",       // Statutory Amber / Saffron (high contrast, non-gradient)
          "saffron-light": "#D97706",
          "saffron-soft": "#FEF3C7", // Background for warning/QCO
          paper: "#F8FAFC",         // Institutional off-white background
          surface: "#FFFFFF",       // Clean crisp white surface
          muted: "#F1F5F9",         // Subtle gray for table headers
          border: "#E2E8F0",        // Precision hairline border
          "border-strong": "#CBD5E1", // Accent divider border
          text: "#0F172A",          // High contrast primary text
          "text-muted": "#64748B",  // Secondary text
          green: "#047857",         // Statutory Pass / Active
          "green-soft": "#ECFDF5",
          "green-border": "#A7F3D0",
          red: "#B91C1C",           // Suspended / Non-compliant
          "red-soft": "#FEF2F2",
          "red-border": "#FECACA"
        },
        // Backward-compatible bis tokens mapped to crisp institutional palette
        bis: {
          navy: "#0A192F",
          "navy-light": "#1E293B",
          "navy-dark": "#050C17",
          "navy-muted": "#334155",
          blue: "#1E3A8A",
          "blue-light": "#2563EB",
          "blue-soft": "#EFF6FF",
          saffron: "#B45309",
          "saffron-light": "#D97706",
          "saffron-soft": "#FEF3C7",
          "saffron-dark": "#92400E",
          canvas: "#F8FAFC",
          surface: "#FFFFFF",
          "surface-muted": "#F1F5F9",
          border: "#E2E8F0",
          "border-strong": "#CBD5E1",
          "text-primary": "#0F172A",
          "text-secondary": "#475569",
          "text-muted": "#64748B",
        },
      },
      fontFamily: {
        serif: ["Charter", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
        md: "6px",
        lg: "8px",
        xl: "12px", // Maximum restrained radius
      },
      boxShadow: {
        none: "none",
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        panel: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.04)",
        dropdown: "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -2px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
