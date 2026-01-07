import Image from "next/image";
import { Terminal, Cpu, Globe, Zap, Briefcase, GraduationCap, MapPin, FileText, Award } from "lucide-react";
import type { Metadata } from "next";

// 1. SEO (Solo funciona en Server Components o layouts, si es page.tsx está bien)
export const metadata: Metadata = {
  title: "Sobre Mí | Daniel Durán",
  description: "Desarrollador Full Stack e Ingeniero IoT. Conoce mi experiencia y habilidades.",
};

export default function AboutPage() {
  
  const skills = [
    { category: "Frontend", items: ["Next.js 14", "React", "Tailwind CSS", "TypeScript", "Framer Motion"] },
    { category: "Backend", items: ["Node.js", "Supabase", "PostgreSQL", "Express", "Python", "Java"] }, // Reduje items para balancear
    { category: "IoT / Hardware", items: ["ESP32", "Arduino", "MQTT", "C++", "Sensors", "PCB Design"] },
    { category: "DevOps & Tools", items: ["Git", "Docker", "Linux", "VS Code", "Figma"] },
  ];

  const experience = [
    {
      year: "2024 - Presente",
      title: "Desarrollador Full Stack & IoT",
      company: "Freelance / Proyectos Propios",
      desc: "Arquitectura de soluciones escalables usando Next.js y Supabase. Desarrollo de prototipos IoT con ESP32 y dashboard en tiempo real."
    },
    {
      year: "2023 - Presente",
      title: "Ayudante de Cátedra",
      company: "Universidad Católica del Norte",
      desc: "Apoyo docente en asignaturas de P. Programación Avanzada y Estructura de Datos. Mentoria a alumnos de primer año."
    },
  ];

  // 2. NUEVA SECCIÓN: Certificaciones (Ejemplo)
  const certifications = [
    { name: "Scrum Fundamentals Certified", issuer: "SCRUMstudy", year: "2023" },
    { name: "Curso de Next.js Avanzado", issuer: "Udemy", year: "2024" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 max-w-6xl mx-auto space-y-20 animate-in fade-in duration-700">
      
      {/* SECCIÓN 1: HEADER & BIO */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        
        {/* Columna Izquierda: Avatar y Stats */}
        <div className="md:col-span-4 space-y-6 sticky top-24"> {/* sticky para que te siga al bajar */}
          <div className="relative aspect-square w-full max-w-xs mx-auto rounded-2xl overflow-hidden border border-white/10 group shadow-2xl shadow-primary/10">
            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors" />
            <Image 
              src="https://i.imgur.com/gPSZfqh.png" 
              alt="Foto de perfil de Daniel"
              fill
              // 3. OPTIMIZACIÓN DE IMAGEN
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
              priority // Carga prioritaria
            />
          </div>

          {/* Stats Box */}
          <div className="bg-surface/50 backdrop-blur-sm border border-white/10 p-5 rounded-xl space-y-4 font-mono text-sm shadow-lg">
            {/* ... Stats iguales que antes ... */}
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-text-muted">Ubicación</span>
              <span className="text-white flex items-center gap-1"><MapPin className="w-3 h-3 text-red-400" /> Chile</span>
            </div>
            <div className="flex justify-between items-center">
               <span className="text-text-muted">Disponibilidad</span>
               <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                 <span className="relative flex h-1.5 w-1.5">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                 </span>
                 Open to Work
               </span>
            </div>
          </div>
          
          {/* 4. BOTÓN DESCARGAR CV (Muy importante) */}
          <div className="w-full">
            {/* Etiqueta opcional para dar contexto */}
            <p className="text-xs text-text-muted uppercase font-mono mb-2 text-center opacity-70">
              Descargar CV
            </p>
            
            <div className="flex gap-3">
              {/* Opción Español */}
              <a 
                href="/CV.pdf" // <--- Asegúrate de tener este archivo
                download="CV_Daniel_Duran_ES.pdf"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all group"
                title="Descargar en Español"
              >
                <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-primary" />
                <span className="font-bold text-sm">ES</span>
              </a>

              {/* Opción Inglés */}
              <a 
                href="/CV_English.pdf" // <--- Asegúrate de tener este archivo
                download="CV_Daniel_Duran_EN.pdf"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-all group"
                title="Download in English"
              >
                <FileText className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-purple-400" />
                <span className="font-bold text-sm">EN</span>
              </a>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Historia */}
        <div className="md:col-span-8 space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
              Ingeniería de Software <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                 & Innovación IoT
              </span>
            </h1>
            <h2 className="text-lg text-text-muted font-light flex items-center gap-2">
              <Terminal className="w-5 h-5 text-primary" />
              Hola, soy Daniel. Construyo cosas para la web y el mundo físico.
            </h2>
          </div>
          
          <div className="prose prose-invert max-w-none text-text-muted/90 leading-relaxed space-y-4">
            <p>
              Soy estudiante de <strong className="text-white">Ingeniería en Tecnologías de la Información</strong>. 
              Mi pasión reside en la intersección entre el software y el hardware. No solo me gusta escribir código que corre en servidores, 
              sino también código que interactúa con sensores y actuadores.
            </p>
            <p>
              Actualmente combino mis estudios con el desarrollo freelance, enfocándome en arquitecturas limpias y escalables.
              Aunque mi fortaleza está en el <strong className="text-white">Back-end</strong>, disfruto creando interfaces fluidas en React/Next.js.
            </p>
          </div>

          {/* Botones Sociales */}
          <div className="flex gap-4 border-t border-white/10 pt-6">
             <a href="/contact" className="px-6 py-2.5 bg-primary text-background font-bold rounded-lg hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)]">
               Contactar
             </a>
             <a href="https://github.com/Charmandiox9" target="_blank" className="px-6 py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-white">
                <Globe className="w-4 h-4" /> GitHub
             </a>
             <a href="linkedin.com/in/daniel-durán-garcía" target="_blank" className="px-6 py-2.5 border border-white/20 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2 text-white">
                <Briefcase className="w-4 h-4" /> LinkedIn
             </a>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: SKILL MATRIX (Pequeño ajuste visual) */}
      <div className="space-y-8">
        <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Stack Tecnológico
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skillGroup, idx) => (
            <div key={skillGroup.category} className="bg-surface/30 border border-white/5 p-5 rounded-xl hover:bg-surface/50 transition-all hover:-translate-y-1 duration-300">
              <h4 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-4">
                {skillGroup.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {skillGroup.items.map((item) => (
                  <span key={item} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-xs text-text-muted hover:text-white hover:border-primary/50 transition-colors cursor-default">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN 3: EXPERIENCE & EDUCATION (Layout 2 columnas abajo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Experiencia */}
        <div className="space-y-8">
          <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-400" />
            Experiencia
          </h3>

          <div className="relative border-l border-white/10 ml-3 space-y-10">
            {experience.map((exp, index) => (
              <div key={index} className="relative pl-8 group">
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-surface border border-text-muted group-hover:border-primary group-hover:bg-primary transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
                
                <span className="text-xs font-mono text-primary mb-1 block">{exp.year}</span>
                <h4 className="text-lg font-bold text-white">{exp.title}</h4>
                <p className="text-sm text-text-muted/60 mb-2">{exp.company}</p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {exp.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Educación y Certificaciones */}
        <div className="space-y-8">
            {/* Educación */}
            <div>
                <h3 className="text-2xl font-display font-bold text-white flex items-center gap-2 mb-8">
                    <GraduationCap className="w-6 h-6 text-purple-400" />
                    Educación
                </h3>
                <div className="bg-surface/30 border border-white/5 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <GraduationCap className="w-24 h-24" />
                    </div>
                    <h4 className="text-lg font-bold text-white">Ingeniería en Tecnologías de Información</h4>
                    <p className="text-primary text-sm font-mono mb-4">Universidad Católica del Norte</p>
                    <p className="text-sm text-text-muted">Actualmente cursando. Enfocado en desarrollo de software y sistemas embebidos.</p>
                </div>
            </div>

            {/* Certificaciones (Opcional, pero recomendado) */}
            {certifications.length > 0 && (
                <div>
                    <h3 className="text-xl font-display font-bold text-white flex items-center gap-2 mb-6 mt-8">
                        <Award className="w-5 h-5 text-orange-400" />
                        Certificaciones
                    </h3>
                    <div className="space-y-3">
                        {certifications.map((cert, i) => (
                            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-white">{cert.name}</p>
                                    <p className="text-xs text-text-muted">{cert.issuer}</p>
                                </div>
                                <span className="text-xs font-mono text-white/30">{cert.year}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

      </div>

    </div>
  );
}