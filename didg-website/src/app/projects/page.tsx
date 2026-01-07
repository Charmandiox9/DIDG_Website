import { createClient } from "@/infrastructure/supabase/server";
import { ProjectsInteractiveGrid } from "@/components/projects/ProjectsInteractiveGrid";
import { Terminal } from "lucide-react";
import type { Metadata } from "next"; // 1. Importar tipo para SEO

export const revalidate = 3600;

// 1. CONFIGURACIÓN SEO
export const metadata: Metadata = {
  title: "Proyectos y Portafolio | Daniel Durán",
  description: "Explora mi colección de desarrollos en Ingeniería de Software, automatización IoT y aplicaciones web full-stack.",
  openGraph: {
    title: "Proyectos | Daniel Durán",
    description: "Archivo de proyectos de desarrollo de software y hardware.",
    // images: ['/tu-imagen-og.jpg'] // Opcional: imagen para compartir en redes
  }
};

export default async function PublicProjectsPage() {
  const supabase = await createClient();

  // 2. QUERY OPTIMIZADA
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true) // <--- IMPORTANTE: Solo mostrar los publicados
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    // Podrías retornar un componente de error o dejar que el array vacío maneje la UI
  }

  // 3. EXTRACCIÓN DE CATEGORÍAS ÚNICAS (Opcional, para pasar al Grid)
  // Si tus proyectos tienen un array de tags (ej: ['IoT', 'React']), esto saca los únicos.
  const allTags = Array.from(
    new Set(projects?.flatMap((p: any) => p.tech_stack || []) || [])
  );

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Header Sección */}
      <div className="mb-16 text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4 ring-1 ring-primary/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Terminal className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
          Archivo de <span className="text-primary">Proyectos</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-light">
          Una colección de desarrollos en Ingeniería de Software, scripts de automatización y prototipos de IoT.
        </p>
      </div>

      {/* Grid Interactiva */}
      {projects && projects.length > 0 ? (
          <ProjectsInteractiveGrid 
            projects={projects} 
            availableTags={allTags} // <--- Pasamos los tags disponibles si tu Grid tiene filtros
          />
      ) : (
        <div className="text-center py-20 border border-dashed border-white/10 rounded-xl bg-white/5 animate-in zoom-in duration-500">
          <p className="text-text-muted font-mono flex flex-col items-center gap-2">
            <span className="text-2xl opacity-50">👾</span>
            Inicializando repositorio... <br/>
            Aún no hay proyectos públicos disponibles.
          </p>
        </div>
      )}

    </div>
  );
}