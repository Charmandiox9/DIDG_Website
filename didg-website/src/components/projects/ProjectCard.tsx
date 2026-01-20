"use client";

import Image from "next/image";
import { Github, Star, ArrowUpRight } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { Database } from "@/types/supabase";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
  className?: string;
  onClick?: () => void;
}

export function ProjectCard({ project, className, onClick }: ProjectCardProps) {
  // Extraemos is_featured para usarlo en la lógica visual
  const { is_featured } = project;

  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-surface/50 transition-all duration-500 cursor-pointer",
        
        // --- LÓGICA DE ESTILOS SEGÚN ESTADO ---
        
        // 1. ESTADO NORMAL (Si NO es destacado)
        !is_featured && "border border-text-main/10 hover:shadow-[0_0_30px_var(--primary-glow)] hover:border-primary/50",
        
        // 2. ESTADO DESTACADO (Gold/Yellow Theme)
        // Usamos un borde amarillo sutil y una sombra dorada
        is_featured && "border border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.1)] hover:border-yellow-400 hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]",
        
        className
      )}
    >
      
      {/* Imagen con Overlay */}
      <div className="relative h-56 w-full overflow-hidden">
        {project.image_urls?.[0] ? (
          <Image
            src={project.image_urls[0]}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-surface to-background flex items-center justify-center">
            <span className="text-text-muted font-mono text-xs">NO IMAGE DATA</span>
          </div>
        )}
        
        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-90" />
        
        {/* --- BADGE DE DESTACADO (NUEVO) --- */}
        {is_featured && (
            <div className="absolute top-4 left-4 z-20 animate-in slide-in-from-left-2 duration-500">
                <span className="flex items-center gap-1 px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-black bg-yellow-500 rounded-sm shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                    <Star className="w-3 h-3 fill-black" /> Destacado
                </span>
            </div>
        )}

        {/* Badge Categoría (Derecha) */}
        <div className="absolute top-4 right-4">
          <span className={cn(
            "px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-background rounded-sm shadow-lg",
            // Si es destacado mantenemos el primary para la categoría, o podrías cambiarlo
            "bg-primary shadow-[0_0_10px_var(--primary-glow)]"
          )}>
            {project.category}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-6 relative">
        {/* Título: Cambia a dorado si es destacado al hacer hover */}
        <h3 className={cn(
            "text-xl font-display font-bold text-text-main mb-2 transition-colors",
            is_featured ? "group-hover:text-yellow-500" : "group-hover:text-primary"
        )}>
          {project.title}
        </h3>
        
        <p className="text-text-muted text-sm line-clamp-3 mb-6 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span key={tech} className={cn(
                "px-2 py-1 text-[10px] font-mono border rounded bg-opacity-5",
                // Tech badges también reaccionan al color del tema
                is_featured 
                    ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5" 
                    : "text-primary border-primary/20 bg-primary/5"
            )}>
              {tech}
            </span>
          ))}
        </div>

        {/* Links Footer */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-text-main/10" onClick={(e) => e.stopPropagation()}>
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-text-main transition-colors">
              <Github className="w-4 h-4" /> CODE
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noreferrer" className={cn(
                "flex items-center gap-2 text-xs font-mono text-text-muted transition-colors ml-auto",
                is_featured ? "hover:text-yellow-500" : "hover:text-primary"
            )}>
              LIVE DEMO <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}