"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { AyudantiaTimelineItem } from "./AyudantiaTimelineItem";

interface Props {
  ayudantias: any[];
}

export function AyudantiaList({ ayudantias }: Props) {
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
      <div className="flex flex-col sm:flex-row gap-4 bg-surface/30 p-4 rounded-xl border border-white/5 backdrop-blur-md sticky top-4 z-40 shadow-xl">
        
        {/* Input Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar ayudantía..." 
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          <button 
            onClick={() => setFilterType("ALL")}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${filterType === 'ALL' ? 'bg-primary/20 border-primary text-primary' : 'border-white/10 text-text-muted hover:bg-white/5'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilterType("PDF")}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${filterType === 'PDF' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'border-white/10 text-text-muted hover:bg-white/5'}`}
          >
            PDFs
          </button>
          <button 
            onClick={() => setFilterType("VIDEO")}
            className={`px-3 py-2 text-xs font-bold rounded-lg border transition-all ${filterType === 'VIDEO' ? 'bg-red-500/20 border-red-500 text-red-400' : 'border-white/10 text-text-muted hover:bg-white/5'}`}
          >
            Videos
          </button>
        </div>
      </div>

      {/* --- TIMELINE --- */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
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
                />
            );
        })}

        {filtered.length === 0 && (
            <div className="text-center py-10 text-text-muted italic">
                No se encontraron resultados para tu búsqueda.
            </div>
        )}
      </div>
    </div>
  );
}