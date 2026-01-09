"use client";

import { useState } from "react";
import { Code2, BookOpen, PenTool, ExternalLink, Download, Maximize2, X, Hash, Globe } from "lucide-react";
import { trackDownload } from "@/core/actions/analytics";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  file_url?: string;
  external_url?: string;
}

export function ResourceCard({ resource }: { resource: Resource }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // CONFIG: Longitud máxima antes de truncar
  const MAX_LENGTH = 120;
  const isLongText = resource.description.length > MAX_LENGTH;

  // Lógica de truncado visual
  const displayedDescription = isLongText 
    ? resource.description.substring(0, MAX_LENGTH).trim() + "..." 
    : resource.description;

  // Icono según categoría
  const getIcon = () => {
    switch (resource.category) {
      case 'CODE': return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'TOOL': return <PenTool className="w-5 h-5 text-purple-400" />;
      default: return <BookOpen className="w-5 h-5 text-emerald-400" />;
    }
  };

  const handleDownload = () => {
    if (resource.file_url) {
       trackDownload(resource.title, "Recursos Extra");
    }
  };

  const fileLink = resource.file_url 
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/materials/${resource.file_url}` 
    : null;

  // Determinar la acción principal de la tarjeta pequeña
  // Prioridad: Link Externo > Archivo > Nada
  const mainActionUrl = resource.external_url || fileLink || "#";
  const MainActionIcon = resource.external_url ? ExternalLink : Download;
  const mainActionLabel = resource.external_url ? "Visitar Web" : "Descargar";

  return (
    <>
      {/* --- TARJETA PRINCIPAL --- */}
      <div className="group relative bg-surface border border-text-main/10 rounded-xl p-5 hover:border-primary/50 transition-all hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] flex flex-col h-full">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-background rounded-lg border border-text-main/5 group-hover:bg-primary/10 transition-colors">
            {getIcon()}
          </div>
          <div className="flex gap-1 flex-wrap justify-end max-w-[60%]">
            {resource.tags?.slice(0, 2).map(tag => ( // Solo mostramos 2 tags en la tarjeta pequeña
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-text-main/5 text-text-muted font-mono">
                #{tag}
              </span>
            ))}
            {resource.tags?.length > 2 && (
               <span className="text-[10px] px-2 py-0.5 rounded-full bg-text-main/5 text-text-muted font-mono">+{resource.tags.length - 2}</span>
            )}
          </div>
        </div>

        {/* Content */}
        <h3 className="font-bold text-lg text-text-main mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {resource.title}
        </h3>
        
        <div className="mb-6 flex-1">
            <p className="text-sm text-text-muted">
                {displayedDescription}
            </p>
            {isLongText && (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                    <Maximize2 className="w-3 h-3" /> Mostrar todo
                </button>
            )}
        </div>

        {/* Footer Action (Botón Principal) */}
        <a 
          href={mainActionUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => !resource.external_url && handleDownload()}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-background border border-text-main/10 text-sm font-bold text-text-main hover:bg-text-main hover:text-background transition-all"
        >
          <MainActionIcon className="w-4 h-4"/>
          {mainActionLabel}
        </a>
      </div>

      {/* --- MODAL DE DETALLE COMPLETO --- */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in"
            onClick={() => setIsModalOpen(false)}
        >
            <div 
                className="w-full max-w-2xl bg-surface border border-text-main/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="p-6 border-b border-text-main/10 flex justify-between items-start bg-background/50">
                    <div className="flex gap-4">
                        <div className="p-3 h-fit bg-primary/10 rounded-xl text-primary border border-primary/20">
                            {getIcon()}
                        </div>
                        <div>
                            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">{resource.category}</span>
                            <h2 className="text-2xl font-bold text-text-main mt-1">{resource.title}</h2>
                            <div className="flex gap-2 flex-wrap mt-3">
                                {resource.tags?.map(tag => (
                                    <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-text-main/5 text-text-muted font-mono border border-text-main/5">
                                        <Hash className="w-3 h-3 opacity-50"/> {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-text-main/5 rounded-full text-text-muted hover:text-text-main transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <h4 className="text-sm font-bold text-text-muted uppercase mb-3">Descripción</h4>
                    <p className="text-text-main leading-relaxed whitespace-pre-wrap">
                        {resource.description}
                    </p>
                </div>

                {/* Modal Footer (Acciones) */}
                <div className="p-6 border-t border-text-main/10 bg-background/50 flex flex-wrap gap-4 justify-end">
                    
                    {/* Botón 1: Descargar Archivo (Si existe) */}
                    {resource.file_url && (
                         <a 
                            href={fileLink!}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface border border-text-main/10 text-text-main hover:border-primary/50 hover:text-primary transition-all font-bold text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Descargar Archivo
                        </a>
                    )}

                    {/* Botón 2: Ir a Web (Si existe) */}
                    {resource.external_url && (
                        <a 
                            href={resource.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-background hover:bg-primary/90 shadow-[0_0_15px_var(--primary-glow)] transition-all font-bold text-sm"
                        >
                            <Globe className="w-4 h-4" />
                            Visitar Sitio Web
                        </a>
                    )}

                    {/* Fallback si no hay nada (raro) */}
                    {!resource.file_url && !resource.external_url && (
                         <span className="text-sm text-text-muted italic">Este recurso es solo informativo.</span>
                    )}

                </div>
            </div>
        </div>
      )}
    </>
  );
}