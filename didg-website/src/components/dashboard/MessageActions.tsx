"use client";

import { Check, CheckCheck } from "lucide-react";
import { markMessageAsRead } from "@/core/actions/messages";
import { useState, useTransition } from "react";

export function MessageActions({ id, isRead }: { id: string; isRead: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticRead, setOptimisticRead] = useState(isRead);

  const handleMarkAsRead = () => {
    if (optimisticRead) return; // Si ya está leído, no hacemos nada

    // Actualización optimista (cambia la UI antes de que el servidor responda)
    setOptimisticRead(true);
    
    startTransition(async () => {
      await markMessageAsRead(id);
    });
  };

  if (optimisticRead) {
    return (
      <div className="flex items-center gap-1 text-emerald-500 text-xs font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
        <CheckCheck className="w-3 h-3" />
        <span>Visto</span>
      </div>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Evita que clicks en el botón activen otros eventos del padre
        handleMarkAsRead();
      }}
      disabled={isPending}
      className="flex items-center gap-1 text-primary hover:text-white hover:bg-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded transition-all text-xs font-bold font-mono shadow-[0_0_10px_var(--primary-glow)] disabled:opacity-50"
      title="Marcar como leído"
    >
      <Check className="w-3 h-3" />
      {isPending ? "..." : "Marcar Visto"}
    </button>
  );
}