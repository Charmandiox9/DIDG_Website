"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Definimos nuestra propia interfaz para evitar importar de 'dist/types'
interface ThemeProviderProps {
  children: React.ReactNode;
  [key: string]: any; // Permite cualquier otra prop que next-themes necesite
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}