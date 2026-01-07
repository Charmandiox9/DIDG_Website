/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. IMPORTANTE: Esto habilita el cambio de tema mediante la clase .dark
  darkMode: ["class"], 
  
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 2. CORRECCIÓN: Usamos var(...) en lugar de códigos Hex (#...)
        // Esto permite que el CSS global controle el color según el modo (Claro/Oscuro)
        background: "var(--background)", 
        surface: "var(--surface)",       
        primary: {
          DEFAULT: "var(--primary)",     
          glow: "var(--primary-glow)",   
        },
        secondary: {
          DEFAULT: "var(--secondary)",   
        },
        text: {
          main: "var(--text-main)",      
          muted: "var(--text-muted)",    
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains)'],
        display: ['var(--font-orbitron)'],
      },
      backgroundImage: {
        // 3. CORRECCIÓN: Usamos var(--grid-color) para que la rejilla
        // sea negra suave en modo claro y blanca en modo oscuro
        'cyber-grid': "linear-gradient(to right, var(--grid-color) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};