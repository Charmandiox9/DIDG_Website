"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";
import { useFloatingUI } from "@/context/FloatingUIContext";
import { cn } from "@/core/utils/cn";

export function GlobalRequestButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isVisible } = useFloatingUI();

  // Mantenemos visible si el modal está abierto, sino obedecemos al toggle
  const shouldShow = isVisible || isOpen;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        // CAMBIO: bottom-20 (aprox 80px desde abajo).
        // ANIMACIÓN: Si !shouldShow, bajamos (translate-y-16) y desaparecemos.
        className={cn(
            "fixed right-4 bottom-20 md:right-6 md:bottom-6 z-50 flex items-center gap-2 px-4 py-3 bg-primary text-background rounded-full shadow-[0_0_20px_var(--primary-glow)] hover:scale-105 active:scale-95 transition-all duration-300 font-bold text-xs md:text-sm",
            shouldShow 
                ? "opacity-100 translate-y-0 scale-100" 
                : "opacity-0 translate-y-16 scale-50 pointer-events-none"
        )}
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span>Solicitar Tema</span>
      </button>

      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        type="request" 
      />
    </>
  );
}