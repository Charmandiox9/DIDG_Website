"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AyudantiaCard } from "./AyudantiaCard";

interface Props {
  ayudantias: any[];
  subjectId: string;
}

export function AdminAyudantiaList({ ayudantias, subjectId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "PDF" | "VIDEO">("ALL");

  // Lógica de filtrado (Igual a la pública)
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
      
      {/* --- BARRA DE HERRAMIENTAS (Búsqueda + Filtros) --- */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        
        {/* Input Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar en mis ayudantías..." 
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

      {/* --- LISTA DE TARJETAS --- */}
      <div className="space-y-4">
        {filtered.map((ayu) => (
            <AyudantiaCard 
                key={ayu.id} 
                ayu={ayu} 
                subjectId={subjectId} 
            />
        ))}

        {filtered.length === 0 && (
            <div className="text-center py-10 text-text-muted italic border border-dashed border-white/10 rounded-xl">
                {searchTerm ? "No se encontraron ayudantías con ese filtro." : "Aún no has creado ayudantías."}
            </div>
        )}
      </div>
    </div>
  );
}