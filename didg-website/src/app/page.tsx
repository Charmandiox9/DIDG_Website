import Link from "next/link";
import { ArrowRight, Code2, Database } from "lucide-react";

export default function Home() {
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
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Open to Work</span>
        </div>

        {/* Título Principal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-white leading-tight">
          ARCHITECTING <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-secondary animate-gradient-x">
            THE FUTURE
          </span>
        </h1>

        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          Ingeniero de Software y Desarrollador Full-Stack especializado en 
          <span className="text-text-main font-medium"> Arquitectura Limpia</span>, 
          <span className="text-text-main font-medium"> IoT</span> y soluciones escalables.
        </p>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link 
            href="/projects" 
            className="group px-8 py-4 bg-primary text-background font-bold text-lg rounded hover:bg-white transition-all duration-300 flex items-center gap-2"
          >
            Ver Proyectos
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
    </div>
  );
}