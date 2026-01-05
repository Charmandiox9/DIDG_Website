import { createClient } from "@/infrastructure/supabase/server";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Terminal } from "lucide-react";

// Opcional: Revalidación de datos cada hora para mantenerlo fresco
export const revalidate = 3600;

export default async function PublicProjectsPage() {
  const supabase = await createClient();

  // Obtener proyectos (Público general)
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
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
          Archivo de <span className="text-primary">Proyectos</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-light">
          Una colección de desarrollos en Ingeniería de Software, scripts de automatización y prototipos de IoT.
        </p>
      </div>

      {/* Grid de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* Estado vacío */}
      {(!projects || projects.length === 0) && (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
          <p className="text-text-muted font-mono">
            Inicializando repositorio... No se encontraron proyectos públicos.
          </p>
        </div>
      )}
    </div>
  );
}