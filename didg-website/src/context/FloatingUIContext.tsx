"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FloatingUIContextType {
  isVisible: boolean;
  toggleVisibility: () => void;
}

const FloatingUIContext = createContext<FloatingUIContextType | undefined>(undefined);

export function FloatingUIProvider({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <FloatingUIContext.Provider value={{ isVisible, toggleVisibility }}>
      {children}
    </FloatingUIContext.Provider>
  );
}

export function useFloatingUI() {
  const context = useContext(FloatingUIContext);
  if (!context) {
    throw new Error("useFloatingUI debe usarse dentro de un FloatingUIProvider");
  }
  return context;
}