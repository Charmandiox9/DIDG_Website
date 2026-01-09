import Link from "next/link";
import { ArrowRight, Code2, Database, TerminalSquare, BookOpen, GraduationCap } from "lucide-react";
import { createClient } from "@/infrastructure/supabase/server";
import { CodeTerminal } from "@/components/home/CodeTerminal";
import { CharmanderPet } from "@/components/home/CharmanderPet";
import { ProjectsInteractiveGrid } from "@/components/projects/ProjectsInteractiveGrid";
import type { Metadata } from "next";

// 1. CONFIGURACIÓN ISR: La portada se regenera cada 1 hora.
export const revalidate = 3600;

// 2. SEO: Importante para Google y compartir en redes.
export const metadata: Metadata = {
  title: "DIDG | Developer & Architect",
  description: "Portafolio de Daniel Durán. Estudiante de Ingeniería TI, Ayudante Universitario y Desarrollador Full Stack especializado en Next.js y IoT.",
  openGraph: {
    title: "Daniel Durán - Portfolio",
    description: "Full-Stack • Ingeniería TI • Ayudante ",
    // images: ['/og-image.jpg'],
  }
};

export default async function Home() {

  const supabase = await createClient();
  
  // 3. QUERY PROYECTOS: Solo los publicados
  const { data: featuredProjects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(3);

  // 4. QUERY AYUDANTÍAS
  const { data: latestSubjects } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .order("created_at", { ascending: false })
    .limit(4);

  const allTags = Array.from(
    new Set(featuredProjects?.flatMap((p: any) => p.tech_stack || []) || [])
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden space-y-24 pb-20">

      {/* --- CHARMANDER --- */}
      <CharmanderPet />
      
      {/* --- HERO SECTION --- */}
      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-2 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Luces de fondo */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-secondary/20 rounded-full blur-[100px] -z-10" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm mx-auto mb-4">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-mono text-primary tracking-widest uppercase"> Ayudante • Full-Stack • Ingeniería TI</span>
        </div>

        {/* Título */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-text-main leading-tight">
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

        {/* Botones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link 
            href="/projects" 
            className="group px-8 py-4 bg-primary text-background font-bold text-lg rounded hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
          >
            Explorar Proyectos
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link 
            href="/contact" 
            className="px-8 py-4 bg-transparent border border-white/10 text-text-main font-mono rounded hover:bg-white/5 transition-all duration-300"
          >
            Contactar
          </Link>
        </div>

        {/* Tech Stack */}
        <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 text-sm font-mono text-center text-text-muted">
          <div className="flex items-center justify-center gap-2 hover:opacity-100 transition-opacity">
            <Code2 className="w-4 h-4 text-primary" /> TypeScript
          </div>
          <div className="flex items-center justify-center gap-2 hover:opacity-100 transition-opacity">
            <Database className="w-4 h-4 text-secondary" /> Supabase
          </div>
          <div className="flex items-center justify-center gap-2 hover:opacity-100 transition-opacity">
            <span className="text-primary font-bold">Node</span>.js 
          </div>
          <div className="flex items-center justify-center gap-2 hover:opacity-100 transition-opacity">
            <span className="text-secondary font-bold">SOLID</span> Principles
          </div>
        </div>
      </div>

      {/* --- SECCIÓN: PROYECTOS DESTACADOS --- */}
      {featuredProjects && featuredProjects.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto w-full z-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-bold text-text-main flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-sm" />
              Últimos Lanzamientos
            </h2>
            <Link href="/projects" className="text-sm font-mono text-primary hover:text-text-main transition-colors flex items-center gap-1 group">
              Ver todos <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grilla Interactiva (Muestra buscador y filtros automáticamente) */}
          <ProjectsInteractiveGrid projects={featuredProjects} availableTags={allTags} />
          
        </section>
      )}

      {/* --- SECCIÓN: ÚLTIMAS AYUDANTÍAS --- */}
      {latestSubjects && latestSubjects.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto w-full z-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent blur-3xl -z-10" />

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-display font-bold text-text-main flex items-center gap-2">
              <span className="w-2 h-8 bg-secondary rounded-sm" />
              Material Ayudantías
            </h2>
            <Link href="/courses" className="text-sm font-mono text-secondary hover:text-text-main transition-colors flex items-center gap-1 group">
              Ir a Ayudantías <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
             {latestSubjects.map((subject: any) => (
                <Link 
                  href={`/courses/${subject.id}`} 
                  key={subject.id}
                  className="group relative bg-surface/40 backdrop-blur-md border border-white/10 rounded-xl p-5 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-background/50 rounded-lg text-secondary border border-white/5">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-mono bg-secondary/10 text-secondary px-2 py-1 rounded-full border border-secondary/20">
                                {subject.code}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-text-main mb-1 group-hover:text-secondary transition-colors line-clamp-2">
                            {subject.name}
                        </h3>
                        
                        <div className="mt-auto pt-4 flex items-center gap-2 text-xs text-text-muted">
                            <GraduationCap className="w-3 h-3" />
                            <span>Semestre {subject.semesters?.name}</span>
                        </div>
                    </div>
                </Link>
             ))}
          </div>
        </section>
      )}

      {/* --- SECCIÓN: COMPILADOR --- */}
      <section className="container mx-auto px-4 w-full max-w-5xl">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-white/10 text-xs font-mono text-primary mb-4">
             <TerminalSquare className="w-3 h-3" />
             <span>LIVE COMPILER</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            <span className="text-text-main">Habla mi </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Idioma</span>
          </h2>
          <p className="text-text-muted max-w-lg mx-auto">
            No necesitas instalar nada. Escribe código en Python, Java, C++ o TypeScript y ejecútalo directamente aquí en tiempo real.
          </p>
        </div>

        <CodeTerminal />
      </section>

    </div>
  );
}