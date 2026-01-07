"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { Database } from "@/types/supabase";
import { Search, X } from "lucide-react"; 

type Project = Database['public']['Tables']['projects']['Row'];

interface Props {
  projects: Project[];
  availableTags?: string[]; 
}

export function ProjectsInteractiveGrid({ projects, availableTags }: Props) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // --- AGREGA ESTO ---
  console.log("PROYECTOS RECIBIDOS:", projects);
  if (projects.length > 0) {
     console.log("PRIMER PROYECTO TECH_STACK:", projects[0].tech_stack);
  }

  // 1. Obtener tags únicos automáticamente desde 'tech_stack'
  const tags = useMemo(() => {
    if (availableTags) return availableTags;
    
    // CAMBIO AQUÍ: Usamos p.tech_stack en lugar de p.tags
    const allStack = projects.flatMap((p) => (p.tech_stack as string[]) || []);
    
    return Array.from(new Set(allStack)).sort();
  }, [projects, availableTags]);

  // 2. Lógica de Filtrado en tiempo real
  const filteredProjects = projects.filter((project) => {
    // A. Filtro por Texto (Título o Descripción)
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // B. Filtro por Tech Stack
    // CAMBIO AQUÍ: Usamos project.tech_stack
    const stack = (project.tech_stack as string[]) || [];
    const matchesFilter = activeFilter === "ALL" || stack.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      
      {/* --- BARRA DE CONTROL --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface/30 p-4 rounded-xl border border-white/5 backdrop-blur-sm sticky top-20 z-30">
        
        {/* Buscador */}
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder="Buscar proyecto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-10 py-2 text-sm text-white focus:border-primary focus:outline-none transition-all"
          />
          {searchTerm && (
            <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
                <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Botones de Filtro (Tech Stack) */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            <button
                onClick={() => setActiveFilter("ALL")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all whitespace-nowrap ${
                    activeFilter === "ALL" 
                    ? "bg-primary text-background border-primary" 
                    : "bg-transparent text-text-muted border-white/10 hover:border-white/30"
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
                        ? "bg-white text-black border-white" 
                        : "bg-transparent text-text-muted border-white/10 hover:border-white/30"
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
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-text-muted">No se encontraron proyectos con esos criterios.</p>
            <button 
                onClick={() => { setSearchTerm(""); setActiveFilter("ALL"); }}
                className="mt-4 text-primary text-sm hover:underline"
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