/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#191919",
        surface: "#18181b",
        primary: {
          DEFAULT: "#00f0ff",
          glow: "#00f0ff80",
        },
        secondary: {
          DEFAULT: "#7000ff",
        },
        text: {
          main: "#e2e8f0",
          muted: "#94a3b8",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains)'],
        display: ['var(--font-orbitron)'],
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};