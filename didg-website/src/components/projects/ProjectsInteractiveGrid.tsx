"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { Database } from "@/types/supabase";
import { Search, X, Filter } from "lucide-react"; 

type Project = Database['public']['Tables']['projects']['Row'];

interface Props {
  projects: Project[];
  availableTags?: string[]; 
}

export function ProjectsInteractiveGrid({ projects, availableTags }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // 1. Obtener tags únicos
  const tags = useMemo(() => {
    if (availableTags) return availableTags;
    const allStack = projects.flatMap((p) => (p.tech_stack as string[]) || []);
    return Array.from(new Set(allStack)).sort();
  }, [projects, availableTags]);

  // 2. Lógica de Filtrado
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const stack = (project.tech_stack as string[]) || [];
    const matchesFilter = activeFilter === "ALL" || stack.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* --- BARRA DE CONTROL --- */}
      {/* Usamos bg-surface/50 y backdrop-blur para que se adapte al color del tema */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/50 p-4 rounded-xl border border-text-main/10 backdrop-blur-md sticky top-20 z-30 shadow-sm transition-all duration-300">
        
        {/* Buscador */}
        <div className="relative w-full md:w-auto md:min-w-[300px] group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar proyecto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // CAMBIO: bg-background/50 y text-text-main para legibilidad en ambos temas
            className="w-full bg-background/50 border border-text-main/10 rounded-lg pl-10 pr-10 py-2 text-sm text-text-main placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
          />
          {searchTerm && (
            <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Botones de Filtro (Tech Stack) */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar items-center">
            <Filter className="w-4 h-4 text-text-muted md:hidden shrink-0" />
            
            <button
                onClick={() => setActiveFilter("ALL")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap ${
                    activeFilter === "ALL" 
                    ? "bg-primary text-background border-primary" // El texto del botón activo usa el color de fondo para contraste
                    : "bg-transparent text-text-muted border-text-main/10 hover:border-text-main/30 hover:text-text-main"
                }`}
            >
                Todos
            </button>
            
            {tags.map(tech => (
                <button
                    key={tech}
                    onClick={() => setActiveFilter(tech)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap ${
                        activeFilter === tech 
                        // CAMBIO: Usamos text-main (invertido) para que resalte
                        ? "bg-text-main text-background border-text-main" 
                        : "bg-transparent text-text-muted border-text-main/10 hover:border-text-main/30 hover:text-text-main"
                    }`}
                >
                    {tech}
                </button>
            ))}
        </div>
      </div>

      {/* --- GRID DE PROYECTOS --- */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredProjects.map((project) => (
            <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)} 
            />
            ))}
        </div>
      ) : (
        // Estado Vacío Adaptado
        <div className="text-center py-20 border border-dashed border-text-main/10 rounded-xl bg-surface/30">
            <p className="text-text-muted">No se encontraron proyectos con esos criterios.</p>
            <button 
                onClick={() => { setSearchTerm(""); setActiveFilter("ALL"); }}
                className="mt-4 text-primary text-sm hover:underline font-bold"
            >
                Limpiar filtros
            </button>
        </div>
      )}

      {/* --- MODAL --- */}
      {selectedProject && (
        <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
}