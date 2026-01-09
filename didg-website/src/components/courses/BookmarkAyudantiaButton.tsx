"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleAyudantiaBookmark } from "@/core/actions/bookmarks-ayudantias";
import { cn } from "@/core/utils/cn";

interface Props {
  ayudantiaId: string;
  initialState: boolean;
}

export function BookmarkAyudantiaButton({ ayudantiaId, initialState }: Props) {
  const [isBookmarked, setIsBookmarked] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se abra el modal al dar like
    if (loading) return;
    
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);
    setLoading(true);

    const res = await toggleAyudantiaBookmark(ayudantiaId);
    if (!res.ok) setIsBookmarked(previousState);
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      // Ajustamos estilos para que se vea bien en la tarjeta del timeline
      className="p-2 rounded-full hover:bg-red-500/10 transition-all group/heart z-20"
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