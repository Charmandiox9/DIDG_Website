"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// Si usas una versión reciente de next-themes, el tipo puede ser diferente, 
// pero usualmente esto funciona:
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}