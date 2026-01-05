"use client";

import { X, Github, ExternalLink, Calendar, Layers } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // <--- 1. IMPORTAR ESTO
import { Database } from "@/types/supabase";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Bloquear scroll al montar
    document.body.style.overflow = "hidden";
    
    return () => {
      // Desbloquear scroll al desmontar
      document.body.style.overflow = "unset";
    };
  }, []);

  // Evitamos errores de hidratación esperando a que el cliente monte
  if (!mounted) return null;

  // 2. USAMOS createPortal PARA "TELETRANSPORTAR" EL MODAL AL BODY
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop (Fondo oscuro) */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-200" 
        onClick={onClose}
      />

      {/* Ventana Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white transition-colors border border-white/10 backdrop-blur-sm"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 1. Imagen Grande (Hero) */}
        <div className="relative h-64 md:h-80 w-full">
          {project.image_urls?.[0] ? (
            <Image
              src={project.image_urls[0]}
              alt={project.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-surface flex items-center justify-center text-text-muted">
                Sin Imagen
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          
          <div className="absolute bottom-6 left-6 md:left-10 z-10">
            <span className="px-3 py-1 text-xs font-mono font-bold uppercase bg-primary text-background rounded mb-3 inline-block shadow-lg shadow-primary/20">
                {project.category}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white shadow-black drop-shadow-lg leading-tight">
              {project.title}
            </h2>
          </div>
        </div>

        {/* 2. Contenido Detallado */}
        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Columna Izquierda: Descripción */}
            <div className="md:col-span-2 space-y-6">
                <div>
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Sobre el Proyecto
                    </h3>
                    <p className="text-text-muted leading-relaxed whitespace-pre-line text-sm md:text-base">
                        {project.description}
                    </p>
                </div>

                {/* Galería extra */}
                {project.image_urls && project.image_urls.length > 1 && (
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        {project.image_urls.slice(1).map((url, idx) => (
                            <div key={idx} className="relative h-32 rounded-lg overflow-hidden border border-white/5 hover:border-primary/30 transition-colors">
                                <Image src={url} alt="Gallery" fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Columna Derecha: Sidebar info */}
            <div className="space-y-8">
                
                <div className="flex flex-col gap-3">
                    {project.demo_url && (
                        <a href={project.demo_url} target="_blank" className="w-full py-3 bg-primary hover:bg-white text-background font-bold rounded flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-lg shadow-primary/10">
                            <ExternalLink className="w-4 h-4" /> Ver Demo Live
                        </a>
                    )}
                    {project.repo_url && (
                        <a href={project.repo_url} target="_blank" className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded flex items-center justify-center gap-2 transition-colors">
                            <Github className="w-4 h-4" /> Ver Código
                        </a>
                    )}
                </div>

                <div>
                    <h4 className="text-sm font-mono text-text-muted uppercase mb-3 border-b border-white/10 pb-1">Tecnologías</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.tech_stack?.map(tech => (
                            <span key={tech} className="px-3 py-1 bg-surface border border-white/5 text-xs text-primary/90 rounded-full">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Metadata */}
                <div>
                    <h4 className="text-sm font-mono text-text-muted uppercase mb-3 border-b border-white/10 pb-1">Fecha Realización</h4>
                    <div className="flex items-center gap-2 text-sm text-white">
                        <Calendar className="w-4 h-4 text-secondary" />
                        {/* Usamos project_date si existe, si no created_at */}
                        {new Date(project.project_date || project.created_at).toLocaleDateString('es-CL', { year: 'numeric', month: 'long' })}
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>,
    document.body // <--- AQUÍ: Renderizamos en el body
  );
}