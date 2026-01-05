import Image from "next/image";
import { Terminal, Cpu, Globe, Zap, Briefcase, GraduationCap, MapPin } from "lucide-react";

export default function AboutPage() {
  
  // Datos estáticos (luego podrías moverlos a la DB si quieres)
  const skills = [
    { category: "Frontend", items: ["Next.js 14", "React", "Tailwind CSS", "TypeScript", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Supabase", "PostgreSQL", "Express", "Python", "Java", "C++", "MongoDB"] },
    { category: "IoT / Hardware", items: ["ESP32", "Arduino", "MQTT", "C++", "Sensors Integration"] },
    { category: "Tools", items: ["Git", "Docker", "VS Code", "Figma"] },
  ];

  const experience = [
    {
      year: "2024 - Presente",
      title: "Desarrollador Full Stack & IoT",
      company: "Freelance / Proyectos Propios",
      desc: "Arquitectura de soluciones escalables usando Next.js y Supabase. Desarrollo de prototipos IoT."
    },
    {
      year: "2023 - Presente",
      title: "Ayudante de Cátedra",
      company: "Universidad",
      desc: "Apoyo docente en asignaturas de P. Programación Avanzada, Programación Orientada a Objetos y Estructura de Datos. Creación de material didáctico."
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4 max-w-6xl mx-auto space-y-20 animate-in fade-in duration-700">
      
      {/* SECCIÓN 1: HEADER & BIO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Columna Izquierda: Avatar y Stats */}
        <div className="md:col-span-4 space-y-6">
          <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/10 group">
             {/* Reemplaza src con tu foto real en /public o una URL */}
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors" />
            <Image 
              src="https://i.imgur.com/gPSZfqh.png" // Placeholder (puedes poner tu foto en public/me.jpg)
              alt="Profile"
              fill
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          </div>

          {/* Stats Box */}
          <div className="bg-surface/50 border border-white/10 p-4 rounded-xl space-y-4 font-mono text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-muted">Iteraciones</span>
              <span className="text-primary font-bold">21</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-muted">Clase</span>
              <span className="text-white">Desarrollador de Software</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-muted">Ubicación</span>
              <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3" /> Chile</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Estado</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Online
              </span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Historia */}
        <div className="md:col-span-8 space-y-6">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
            Hola, soy <span className="text-primary">Daniel Ignacio Durán García</span>.
          </h1>
          <h2 className="text-xl text-text-muted font-light flex items-center gap-2">
            <Terminal className="w-5 h-5 text-secondary" />
            Ingeniero de Software & Entusiasta del Hardware
          </h2>
          
          <div className="prose prose-invert max-w-none text-text-muted/80 leading-relaxed">
            <p>
              Soy estudiante de Ingeniería en Tecnologías de la Información. 
              Disfruto desarrollando problemas e investigando tecnologías que puedan fortalecer mis habilidades. 
            </p>
            <p>
              Normalmente trabajo con lenguajes back-end, pero no descarto desarrollar en front-end o full-stack.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
             <a href="/contact" className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors">
                Contactar
             </a>
             <a href="https://github.com/Charmandiox9" target="_blank" className="px-6 py-2 border border-white/20 rounded hover:bg-white/10 transition-colors flex items-center gap-2">
                <Globe className="w-4 h-4" /> GitHub
             </a>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: SKILL MATRIX */}
      <div className="space-y-8">
        <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Matriz de Habilidades
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skillGroup) => (
            <div key={skillGroup.category} className="bg-surface/30 border border-white/5 p-6 rounded-xl hover:border-primary/30 transition-colors group">
              <h4 className="text-lg font-bold text-white mb-4 border-l-2 border-primary pl-3 group-hover:text-primary transition-colors">
                {skillGroup.category}
              </h4>
              <ul className="space-y-2">
                {skillGroup.items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-muted font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: EXPERIENCE LOG */}
      <div className="space-y-8">
        <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-400" />
          Registro de Actividad
        </h3>

        <div className="relative border-l border-white/10 ml-3 space-y-12">
          {experience.map((exp, index) => (
            <div key={index} className="relative pl-8 group">
              {/* Dot en la línea de tiempo */}
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-background border border-text-muted group-hover:border-primary group-hover:bg-primary transition-colors" />
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h4 className="text-xl font-bold text-white">{exp.title}</h4>
                <span className="hidden sm:block text-white/20">•</span>
                <span className="text-primary font-mono text-sm">{exp.company}</span>
              </div>
              
              <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-xs text-text-muted font-mono mb-3 border border-white/5">
                {exp.year}
              </span>
              
              <p className="text-text-muted max-w-2xl">
                {exp.desc}
              </p>
            </div>
          ))}
          
          {/* Item final (Educación) */}
          <div className="relative pl-8 group opacity-70">
            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-background border border-text-muted" />
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-lg font-bold text-white">Ingeniería en Tecnologías de Información</h4>
            </div>
            <p className="text-text-muted text-sm">Universidad Católica del Norte, En curso.</p>
          </div>

        </div>
      </div>

    </div>
  );
}