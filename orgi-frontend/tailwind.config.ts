import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A56DB",
        "primary-dark": "#1243B0",
        "primary-light": "#E8F0FE",
        secondary: "#16BDCA",
        success: "#0EA472",
        "success-light": "#E8F8F0",
        danger: "#E02424",
        "danger-light": "#FDE8E8",
        warning: "#FF8800",
        "warning-light": "#FFF3E0",
        sidebar: "#0F172A",
        "sidebar-hover": "#1E293B",
        "sidebar-active": "#1A56DB",
        "sidebar-text": "#94A3B8",
        "sidebar-heading": "#F8FAFC",
        surface: "#F8FAFC",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        elevated: "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
        modal: "0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.06)",
        kpi: "0 2px 8px rgba(26,86,219,0.08)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
