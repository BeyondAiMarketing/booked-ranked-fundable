import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0,0,0,0.05)",
        "agent-status-glow-active": "0 0 16px oklch(0.62 0.18 155 / 50%)",
        "agent-status-glow-error": "0 0 16px oklch(0.58 0.22 25 / 50%)",
        "agent-status-glow-warning": "0 0 16px oklch(0.72 0.18 75 / 50%)",
        "command-center-lg": "0 12px 40px oklch(0 0 0 / 35%)",
        "command-center-md": "0 8px 24px oklch(0 0 0 / 30%)",
        "command-center-sm": "0 4px 12px oklch(0 0 0 / 25%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "waveform-pulse": {
          "0%, 100%": { height: "60%" },
          "50%": { height: "100%" },
        },
        "slide-up": {
          from: { transform: "translateY(100%)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "checkmark-bounce": {
          "0%": { opacity: "0", transform: "scale(0)" },
          "50%": { transform: "scale(1.2)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "overlay-fade-in": {
          from: { opacity: "0", backdropFilter: "blur(0)" },
          to: { opacity: "1", backdropFilter: "blur(4px)" },
        },
        "act-fill": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "propagation-fill": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "green-flash": {
          "0%": { opacity: "0", backgroundColor: "oklch(0.62 0.18 155 / 0%)" },
          "50%": { opacity: "1", backgroundColor: "oklch(0.62 0.18 155 / 40%)" },
          "100%": { opacity: "0", backgroundColor: "oklch(0.62 0.18 155 / 0%)" },
        },
        "three-act-complete": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "processing-fill": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "agent-float": {
          from: { transform: "translateY(0px)" },
          to: { transform: "translateY(-4px)" },
        },
        "agent-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "status-pulse": {
          "0%, 100%": { boxShadow: "0 0 8px currentColor" },
          "50%": { boxShadow: "0 0 16px currentColor" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "waveform-pulse": "waveform-pulse 0.6s ease-in-out infinite",
        "slide-up": "slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "checkmark-bounce": "checkmark-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards",
        "overlay-fade-in": "overlay-fade-in 0.3s ease-out forwards",
        "act-fill": "act-fill 1s ease-out forwards",
        "propagation-fill": "propagation-fill 2s ease-out forwards",
        "green-flash": "green-flash 1.2s ease-out forwards",
        "three-act-complete": "three-act-complete 0.8s ease-out forwards",
        "processing-fill": "processing-fill 3s ease-out forwards",
        "agent-float": "agent-float 3s ease-in-out infinite",
        "agent-pulse": "agent-pulse 2s ease-in-out infinite",
        "status-pulse": "status-pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
