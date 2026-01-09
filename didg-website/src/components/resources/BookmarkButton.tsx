"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleBookmark } from "@/core/actions/bookmarks";
import { cn } from "@/core/utils/cn";

interface Props {
  resourceId: string;
  initialState: boolean;
}

export function BookmarkButton({ resourceId, initialState }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Evitar abrir el link de la tarjeta
    e.stopPropagation();
    
    if (loading) return;
    
    // Optimistic UI: Cambiamos el estado visualmente antes de que responda el servidor
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setLoading(true);

    const res = await toggleBookmark(resourceId);
    
    if (!res.ok) {
        // Si falló, revertimos
        setIsBookmarked(previousState);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="p-2 rounded-full hover:bg-red-500/10 transition-all group/heart z-20 relative"
      title={isBookmarked ? "Quitar de biblioteca" : "Guardar en biblioteca"}
    >
      <Heart 
        className={cn(
            "w-5 h-5 transition-all duration-300",
            isBookmarked 
                ? "fill-red-500 text-red-500 scale-110" 
                : "text-text-muted group-hover/heart:text-red-500"
        )} 
      />
    </button>
  );
}