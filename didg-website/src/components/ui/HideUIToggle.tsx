"use client";

import { Eye, EyeOff } from "lucide-react";
import { useFloatingUI } from "@/context/FloatingUIContext";
import { cn } from "@/core/utils/cn";

export function HideUIToggle() {
  const { isVisible, toggleVisibility } = useFloatingUI();

  return (
    <button
      onClick={toggleVisibility}
      // CAMBIO: bottom-4 (antes bottom-36). z-[60] para estar encima de todo.
      className={cn(
        "md:hidden fixed bottom-4 right-4 z-[60] flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 shadow-lg border border-text-main/10 active:scale-95",
        isVisible 
          ? "bg-surface text-text-muted" 
          : "bg-primary/10 text-primary border-primary/20 opacity-100"
      )}
      aria-label={isVisible ? "Ocultar botones" : "Mostrar botones"}
    >
      {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
    </button>
  );
}