"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import { FeedbackModal } from "./FeedbackModal";

export function GlobalRequestButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 bg-primary text-background rounded-full shadow-[0_0_20px_var(--primary-glow)] hover:scale-105 transition-transform font-bold text-sm animate-in fade-in slide-in-from-bottom-4"
      >
        <MessageSquarePlus className="w-5 h-5" />
        <span className="hidden sm:inline">Solicitar Tema</span>
      </button>

      <FeedbackModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        type="request" 
      />
    </>
  );
}