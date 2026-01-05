import Link from "next/link";
import { ArrowRight, Code2, Database } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/server"; // Importar cliente
import { ProjectCard } from "@/components/projects/ProjectCard"; // Importar tarjeta

export default async function Home() {

  const supabase = await createClient();
  // Traer solo los últimos 3 proyectos
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden">
      
      {/* Efectos de fondo (Luces) */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-[100px]" />

      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
        
        {/* Badge superior */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mx-auto mb-4 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-mono text-primary tracking-widest uppercase"> Ayudante • Full-Stack • Ingeniería TI</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white leading-tight">
          BUILDING SOFTWARE <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">
            AND TEACHING HOW
          </span>
        </h1>

        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          Estudiante de <span className="text-text-main font-medium">Ingeniería en Tecnologías de la Información</span> y 
          <span className="text-text-main font-medium"> ayudante universitario</span>.  
          Desarrollo aplicaciones web, backend y proyectos académicos aplicando 
          <span className="text-text-main font-medium"> arquitectura limpia</span> y buenas prácticas.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link 
            href="/projects" 
            className="group px-8 py-4 bg-primary text-background font-bold text-lg rounded hover:bg-white transition-all duration-300 flex items-center gap-2"
          >
            Explorar Proyectos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/contact" 
            className="px-8 py-4 bg-transparent border border-white/10 text-white font-mono rounded hover:bg-white/5 transition-all duration-300"
          >
            Contactar_
          </Link>
        </div>

        {/* Tech Stack rápido */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 text-sm font-mono text-center">
          <div className="flex items-center justify-center gap-2">
            <Code2 className="w-4 h-4 text-primary" /> TypeScript
          </div>
          <div className="flex items-center justify-center gap-2">
            <Database className="w-4 h-4 text-secondary" /> Supabase
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary font-bold">NEXT</span> .js 14
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-secondary font-bold">SOLID</span> Principles
          </div>
        </div>

      </div>

      {/* --- NUEVA SECCIÓN: PROYECTOS DESTACADOS --- */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="py-20 px-4 max-w-7xl mx-auto w-full z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-sm" />
              Últimos Lanzamientos
            </h2>
            <Link href="/projects" className="text-sm font-mono text-primary hover:text-white transition-colors flex items-center gap-1">
              Ver todo el archivo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}