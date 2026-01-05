import { createClient } from "@/infrastructure/supabase/server";
import { ProjectsInteractiveGrid } from "@/components/projects/ProjectsInteractiveGrid"; // Importar el wrapper
import { Terminal } from "lucide-react";

export const revalidate = 3600;

export default async function PublicProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header Sección */}
      <div className="mb-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30">
          <Terminal className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main">
          Archivo de <span className="text-primary">Proyectos</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-light">
          Una colección de desarrollos en Ingeniería de Software, scripts de automatización y prototipos de IoT.
        </p>
      </div>

      {/* Grid Interactiva (Cliente) */}
      {projects && projects.length > 0 ? (
          <ProjectsInteractiveGrid projects={projects} />
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
          <p className="text-text-muted font-mono">
            Inicializando repositorio... No se encontraron proyectos públicos.
          </p>
        </div>
      )}

    </div>
  );
}