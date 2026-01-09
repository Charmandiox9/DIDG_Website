import { createClient } from "@/infrastructure/supabase/server";
import { ProjectsInteractiveGrid } from "@/components/projects/ProjectsInteractiveGrid";
import { Terminal, FolderOpen } from "lucide-react"; // Agregué FolderOpen para el estado vacío
import type { Metadata } from "next";
import { CharmanderPet } from "@/components/home/CharmanderPet";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Proyectos y Portafolio | Daniel Durán",
  description: "Explora mi colección de desarrollos en Ingeniería de Software, automatización IoT y aplicaciones web full-stack.",
  openGraph: {
    title: "Proyectos | Daniel Durán",
    description: "Archivo de proyectos de desarrollo de software y hardware.",
  }
};

export default async function PublicProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
  }

  // Extracción de etiquetas únicas
  const allTags = Array.from(
    new Set(projects?.flatMap((p: any) => p.tech_stack || []) || [])
  ).sort();

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <CharmanderPet />
      
      {/* Header Sección */}
      <div className="mb-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Icono con Glow dinámico (usa var(--primary-glow)) */}
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30 shadow-[0_0_20px_var(--primary-glow)]">
          <Terminal className="w-6 h-6 text-primary" />
        </div>

        {/* Título adaptable (text-text-main) */}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main">
          Archivo de <span className="text-primary drop-shadow-[0_0_10px_var(--primary-glow)]">Proyectos</span>
        </h1>

        <p className="text-text-muted max-w-2xl mx-auto text-lg font-light leading-relaxed">
          Una colección de desarrollos en Ingeniería de Software, scripts de automatización y prototipos de IoT.
        </p>
      </div>

      {/* Grid Interactiva */}
      {projects && projects.length > 0 ? (
          <ProjectsInteractiveGrid 
            projects={projects} 
            availableTags={allTags} 
          />
      ) : (
        // Estado Vacío Adaptable
        <div className="text-center py-20 border border-dashed border-text-main/10 rounded-2xl bg-surface/50 backdrop-blur-sm animate-in zoom-in duration-500">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-text-muted/10">
                <FolderOpen className="w-10 h-10 text-text-muted opacity-50" />
            </div>
            <div className="space-y-1">
                <p className="text-text-main font-bold text-lg">
                    Inicializando repositorio...
                </p>
                <p className="text-text-muted font-mono text-sm">
                    Aún no hay proyectos públicos disponibles.
                </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}