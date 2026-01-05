"use client";

import Image from "next/image";
import { Github, Globe, ArrowUpRight } from "lucide-react";
import { cn } from "@/core/utils/cn";
import { Database } from "@/types/supabase";

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectCardProps {
  project: Project;
  className?: string;
  onClick?: () => void; // Nuevo prop
}

export function ProjectCard({ project, className, onClick }: ProjectCardProps) {
  return (
    <div 
      onClick={onClick} // Acción al hacer click en la tarjeta
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl bg-surface/40 border border-white/10 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] cursor-pointer hover:border-primary/50",
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
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
        
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-background bg-primary rounded-sm shadow-[0_0_10px_rgba(0,240,255,0.5)]">
            {project.category}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-6 relative">
        <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        
        <p className="text-text-muted text-sm line-clamp-3 mb-6 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech_stack?.slice(0, 4).map((tech) => (
            <span key={tech} className="px-2 py-1 text-[10px] font-mono text-primary/80 border border-primary/20 rounded bg-primary/5">
              {tech}
            </span>
          ))}
        </div>

        {/* Links Footer: stopPropagation evita abrir el modal si clicas directo en el link */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
          {project.repo_url && (
            <a href={project.repo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-white transition-colors">
              <Github className="w-4 h-4" /> CODE
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono text-text-muted hover:text-primary transition-colors ml-auto">
              LIVE DEMO <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}