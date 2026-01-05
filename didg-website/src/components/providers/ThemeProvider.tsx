"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
// Necesitamos importar el tipo correctamente o usar 'any' si da problemas de TS
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}