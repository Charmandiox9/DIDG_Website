"use client";

import { useState } from "react";
import { Search, Plus, Edit2, Trash2, FileText, Link as LinkIcon } from "lucide-react";
import { ResourceFormModal } from "./ResourceFormModal";
import { deleteResource } from "@/core/actions/admin-resources";

interface Props {
  resources: any[];
}

export function AdminResourceList({ resources }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<any | null>(null);

  // Lógica de Filtrado (Reutilizada)
  const filtered = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.tags?.some((t: string) => t.includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    if (filterCategory !== "ALL" && res.category !== filterCategory) return false;
    return true;
  });

  const handleCreate = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEdit = (res: any) => {
    setEditingResource(res);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este recurso?")) {
        await deleteResource(id);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* BARRA DE HERRAMIENTAS (Search + Filter + Create) */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface/50 p-4 rounded-xl border border-text-main/10 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por título o tag..." 
            className="w-full bg-background/50 border border-text-main/10 rounded-lg pl-10 pr-4 py-2 text-sm text-text-main focus:outline-none focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
           {['ALL', 'CODE', 'TUTORIAL', 'TOOL'].map(cat => (
             <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    filterCategory === cat 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'border-text-main/10 text-text-muted hover:text-text-main'
                }`}
             >
                {cat === 'ALL' ? 'Todos' : cat}
             </button>
           ))}
        </div>

        {/* Create Button */}
        <button onClick={handleCreate} className="px-4 py-2 bg-primary text-background rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_var(--primary-glow)]">
            <Plus className="w-4 h-4" /> Nuevo
        </button>
      </div>

      {/* LISTA DE RESULTADOS (Tabla/Grid Clean) */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((res) => (
            <div key={res.id} className="group flex items-center justify-between p-4 bg-surface border border-text-main/10 rounded-xl hover:border-primary/30 transition-all">
                
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${res.file_url ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {res.file_url ? <FileText className="w-5 h-5"/> : <LinkIcon className="w-5 h-5"/>}
                    </div>
                    <div>
                        <h4 className="font-bold text-text-main group-hover:text-primary transition-colors">{res.title}</h4>
                        <div className="flex gap-2 items-center mt-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-text-main/5 text-text-muted">{res.category}</span>
                            <span className="text-xs text-text-muted flex gap-1">
                                {res.tags?.map((t: string) => <span key={t}>#{t}</span>)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(res)} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(res.id)} className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        ))}
        
        {filtered.length === 0 && (
            <div className="text-center py-10 text-text-muted border border-dashed border-text-main/10 rounded-xl">
                No se encontraron recursos.
            </div>
        )}
      </div>

      {/* Modal Integration */}
      <ResourceFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        resourceToEdit={editingResource} 
      />

    </div>
  );
}