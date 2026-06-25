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
        primary: "#6366F1",
        "primary-dark": "#4F46E5",
        "primary-light": "#EEF2FF",
        "primary-glow": "rgba(99,102,241,0.12)",

        accent: "#8B5CF6",
        "accent-light": "#F5F3FF",

        success: "#10B981",
        "success-light": "#ECFDF5",
        "success-dark": "#059669",
        danger: "#EF4444",
        "danger-light": "#FEF2F2",
        "danger-dark": "#DC2626",
        warning: "#F59E0B",
        "warning-light": "#FFFBEB",
        "warning-dark": "#D97706",

        sidebar: "#0C1222",
        "sidebar-surface": "#111827",
        "sidebar-hover": "#1E293B",
        "sidebar-active": "#6366F1",
        "sidebar-text": "#94A3B8",
        "sidebar-heading": "#F1F5F9",
        "sidebar-border": "rgba(255,255,255,0.05)",

        surface: "#F8FAFC",
        "surface-card": "#FFFFFF",

        neutral: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        card: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
        elevated: "0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.03)",
        modal: "0 24px 80px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.06)",
        kpi: "0 2px 8px rgba(99,102,241,0.06)",
        "kpi-hover": "0 8px 24px rgba(99,102,241,0.10)",
        glass: "0 4px 24px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        "gradient-success": "linear-gradient(135deg, #10B981 0%, #059669 100%)",
        "gradient-danger": "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
        "gradient-sidebar": "linear-gradient(180deg, #0C1222 0%, #111827 100%)",
        "gradient-surface": "linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-out-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "skeleton-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out both",
        "fade-in-down": "fade-in-down 0.4s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
        "slide-in-left": "slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-out-left": "slide-out-left 0.25s ease-in",
        "skeleton-pulse": "skeleton-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
