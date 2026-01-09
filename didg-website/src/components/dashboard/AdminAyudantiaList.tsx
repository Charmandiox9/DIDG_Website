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
      
      {/* --- BARRA DE HERRAMIENTAS --- */}
      {/* Container: bg-surface/50 y border-text-main/10 */}
      <div className="flex flex-col sm:flex-row gap-4 bg-surface/50 p-4 rounded-xl border border-text-main/10 backdrop-blur-sm shadow-sm transition-colors">
        
        {/* Input Buscador */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar en mis ayudantías..." 
            // Input Adaptable
            className="w-full bg-background/50 border border-text-main/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text-main focus:outline-none focus:border-primary/50 transition-colors placeholder:text-text-muted/50"
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
            // Cambiado a text-blue-500 para legibilidad en light mode
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
            // Cambiado a text-red-500 para legibilidad en light mode
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
            <div className="text-center py-10 text-text-muted italic border border-dashed border-text-main/10 rounded-xl bg-surface/30">
                {searchTerm ? "No se encontraron ayudantías con ese filtro." : "Aún no has creado ayudantías."}
            </div>
        )}
      </div>
    </div>
  );
}