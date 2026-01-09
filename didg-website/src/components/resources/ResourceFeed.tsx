"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { ResourceCard } from "@/components/resources/ResourceCard";

interface Props {
  resources: any[];
}

export function ResourceFeed({ resources }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");

  // Lógica de Filtrado
  const filtered = resources.filter((res) => {
    const term = searchTerm.toLowerCase();
    
    // 1. Coincidencia por Texto (Título o Tags)
    const matchesSearch = 
      res.title.toLowerCase().includes(term) || 
      res.tags?.some((t: string) => t.toLowerCase().includes(term));
    
    if (!matchesSearch) return false;

    // 2. Coincidencia por Categoría
    if (filterCategory !== "ALL" && res.category !== filterCategory) return false;

    return true;
  });

  return (
    <div className="space-y-8">
      
      {/* --- BARRA DE CONTROL (Search + Tags) --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface/50 p-4 rounded-2xl border border-text-main/10 backdrop-blur-md sticky top-4 z-30 shadow-lg transition-all duration-300">
        
        {/* Buscador */}
        <div className="relative flex-1 w-full md:w-auto group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por título, tecnología o tag..." 
            className="w-full bg-background/50 border border-text-main/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtros de Categoría */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
           {['ALL', 'CODE', 'TUTORIAL', 'TOOL'].map(cat => (
             <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 text-xs font-bold rounded-lg border whitespace-nowrap transition-all ${
                    filterCategory === cat 
                    ? 'bg-primary/10 border-primary text-primary shadow-[0_0_10px_var(--primary-glow)]' 
                    : 'border-text-main/10 text-text-muted hover:bg-text-main/5 hover:text-text-main'
                }`}
             >
                {cat === 'ALL' ? 'Todos' : cat === 'CODE' ? 'Snippets' : cat === 'TOOL' ? 'Tools' : 'Guías'}
             </button>
           ))}
        </div>
      </div>

      {/* --- RESULTADOS --- */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      ) : (
        // Estado Vacío
        <div className="text-center py-20 border border-dashed border-text-main/10 rounded-xl bg-surface/30 animate-in zoom-in-95">
          <Search className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-text-main font-bold text-lg">Sin resultados</h3>
          <p className="text-text-muted text-sm">
            No encontramos nada con "{searchTerm}". <br/>
            ¿Quieres solicitar este tema?
          </p>
        </div>
      )}
    </div>
  );
}