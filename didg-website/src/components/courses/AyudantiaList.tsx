"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { AyudantiaTimelineItem } from "./AyudantiaTimelineItem";

interface Props {
  ayudantias: any[];
  subjectName: string;
  bookmarkedIds?: Set<string>;
}

export function AyudantiaList({ ayudantias, subjectName, bookmarkedIds }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PDF" | "VIDEO">("ALL");

  // Lógica de filtrado
  const filtered = ayudantias.filter((ayu) => {
    const matchesSearch = ayu.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ayu.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterType === "PDF") return ayu.material_url?.toLowerCase().endsWith(".pdf");
    if (filterType === "VIDEO") return !!ayu.video_url;

    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* --- BARRA DE BÚSQUEDA Y FILTROS --- */}
      {/* Fondo surface/50 para que se adapte al tema (blanco/negro) con blur */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface/50 p-4 rounded-xl border border-text-main/10 backdrop-blur-md sticky top-4 z-40 shadow-xl transition-all duration-300">
        
        {/* Input Buscador */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar ayudantía..." 
            // CAMBIO: bg-background/50 y text-text-main
            className="w-full bg-background/50 border border-text-main/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                filterType === 'ALL' 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'border-text-main/10 text-text-muted hover:bg-text-main/5 hover:text-text-main'
            }`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterType("PDF")}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                filterType === 'PDF' 
                ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
                : 'border-text-main/10 text-text-muted hover:bg-text-main/5 hover:text-text-main'
            }`}
          >
            PDFs
          </button>
          <button 
            onClick={() => setFilterType("VIDEO")}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${
                filterType === 'VIDEO' 
                ? 'bg-red-500/10 border-red-500 text-red-500' 
                : 'border-text-main/10 text-text-muted hover:bg-text-main/5 hover:text-text-main'
            }`}
          >
            Videos
          </button>
        </div>
      </div>

      {/* --- TIMELINE --- */}
      {/* Línea vertical: via-text-main/10 para que sea visible en gris o blanco */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-text-main/10 before:to-transparent">
        {filtered.map((ayu) => {
            const isPdf = ayu.material_url?.toLowerCase().endsWith('.pdf');
            const publicUrl = ayu.material_url && !ayu.material_url.startsWith("http") 
                ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/materials/${ayu.material_url}`
                : ayu.material_url;

            return (
                <AyudantiaTimelineItem 
                    key={ayu.id} 
                    ayu={ayu} 
                    publicUrl={publicUrl || ""} 
                    isPdf={isPdf || false} 
                    subjectName={subjectName}
                    isBookmarked={bookmarkedIds?.has(ayu.id) || false}
                />
            );
        })}

        {filtered.length === 0 && (
            <div className="text-center py-10 text-text-muted italic bg-surface/30 rounded-lg border border-dashed border-text-main/10">
                No se encontraron resultados para tu búsqueda.
            </div>
        )}
      </div>
    </div>
  );
}