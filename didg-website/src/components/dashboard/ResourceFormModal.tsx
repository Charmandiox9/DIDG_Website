"use client";

import { useState } from "react";
import { X, Save, Upload, Link as LinkIcon, Loader2 } from "lucide-react";
import { saveResource } from "@/core/actions/admin-resources";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  resourceToEdit?: any | null;
}

export function ResourceFormModal({ isOpen, onClose, resourceToEdit }: Props) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    if (resourceToEdit) {
        formData.append("id", resourceToEdit.id);
        if (resourceToEdit.file_url) {
            formData.append("existing_file_url", resourceToEdit.file_url);
        }
    }

    const res = await saveResource(formData);
    setLoading(false);
    
    if (res.ok) {
        onClose();
    } else {
        alert("Error al guardar");
    }
  };

  return (
    // BACKDROP: bg-black/60 funciona bien en ambos modos para oscurecer el fondo
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      
      {/* MODAL CARD: bg-surface (Blanco en Light, Gris Oscuro en Dark) */}
      <div 
        className="w-full max-w-lg bg-surface border border-text-main/10 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="p-4 border-b border-text-main/10 flex justify-between items-center bg-surface">
          <h3 className="font-bold text-text-main">{resourceToEdit ? "Editar Recurso" : "Nuevo Recurso"}</h3>
          <button onClick={onClose} className="p-1 hover:bg-text-main/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-text-muted hover:text-text-main" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Título */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Título</label>
            <input 
                name="title" 
                required 
                defaultValue={resourceToEdit?.title} 
                // INPUTS: bg-background/50 crea el contraste correcto (Gris claro en Light, Negro en Dark)
                className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2.5 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-text-muted/40" 
                placeholder="Ej: Cheat Sheet de Git" 
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Descripción</label>
            <textarea 
                name="description" 
                rows={3} 
                defaultValue={resourceToEdit?.description} 
                className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2.5 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none resize-none transition-all placeholder:text-text-muted/40" 
                placeholder="Breve descripción del contenido..." 
            />
          </div>

          {/* Categoría y Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Categoría</label>
                <div className="relative">
                    <select 
                        name="category" 
                        defaultValue={resourceToEdit?.category || "CODE"} 
                        className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2.5 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none appearance-none cursor-pointer transition-all"
                    >
                        <option value="CODE">Código / Snippet</option>
                        <option value="TUTORIAL">Tutorial / Guía</option>
                        <option value="TOOL">Herramienta</option>
                    </select>
                    {/* Flecha personalizada para asegurar consistencia visual */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
                    </div>
                </div>
            </div>
            <div>
                <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Tags</label>
                <input 
                    name="tags" 
                    defaultValue={resourceToEdit?.tags?.join(", ")} 
                    className="w-full bg-background/50 border border-text-main/10 rounded-lg p-2.5 text-sm text-text-main focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all placeholder:text-text-muted/40" 
                    placeholder="react, db, api" 
                />
            </div>
          </div>

          {/* SECCIÓN DE RECURSOS (CAJA DECORATIVA) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase">Recursos Adjuntos</label>
            
            {/* Contenedor interno: bg-background/30 para diferenciar del fondo del modal */}
            <div className="p-4 bg-background/30 rounded-xl border border-text-main/10 space-y-4">
                
                {/* A. ENLACE EXTERNO */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded text-blue-500">
                        <LinkIcon className="w-4 h-4" />
                    </div>
                    <input 
                        name="external_url" 
                        type="url" 
                        defaultValue={resourceToEdit?.external_url} 
                        className="flex-1 bg-transparent border-b border-text-main/10 focus:border-primary outline-none text-text-main placeholder:text-text-muted/50 text-sm py-1 transition-colors" 
                        placeholder="https://ejemplo.com (Opcional)" 
                    />
                </div>

                {/* B. ARCHIVO */}
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded text-emerald-500">
                        <Upload className="w-4 h-4" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <input 
                            name="file" 
                            type="file" 
                            className="w-full text-sm text-text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-text-main/5 file:text-text-main hover:file:bg-text-main/10 cursor-pointer" 
                        />
                        {resourceToEdit?.file_url && (
                            <p className="text-[10px] text-emerald-500 mt-1 truncate">
                                Actual: {resourceToEdit.file_url.split('/').pop()}
                            </p>
                        )}
                    </div>
                </div>

            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-2 border-t border-text-main/5 mt-4">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors"
            >
                Cancelar
            </button>
            <button 
                disabled={loading} 
                className="px-6 py-2 bg-primary text-background rounded-lg font-bold text-sm hover:bg-primary/90 flex items-center gap-2 shadow-[0_0_10px_var(--primary-glow)] transition-all disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}