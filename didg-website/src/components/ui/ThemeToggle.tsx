"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-surface border border-primary/20 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_var(--primary)] transition-all duration-300 group"
      aria-label="Cambiar tema"
    >
      {/* Icono Sol (Modo Claro) */}
      <Sun className="h-6 w-6 text-orange-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute top-3 left-3" />
      
      {/* Icono Luna (Modo Oscuro) */}
      <Moon className="h-6 w-6 text-primary rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}