import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Library, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Metadata } from "next";

// 1. CONFIGURACIÓN ISR
export const revalidate = 60; 

// 2. METADATA (SEO)
export const metadata: Metadata = {
  title: "Recursos y Ayudantías | Daniel Durán",
  description: "Material docente, guías de estudio y recursos para estudiantes de Ingeniería Civil Informática.",
  openGraph: {
    title: "Centro de Recursos - Daniel Durán",
    description: "Accede a material de estudio para tus asignaturas.",
  }
};

// 3. DEFINICIÓN DE TIPOS (Para no usar 'any')
interface Subject {
  id: string;
  name: string;
  code: string;
}

interface Semester {
  id: string;
  name: string;
  created_at: string;
  subjects: Subject[];
}

export default async function PublicCoursesPage() {
  const supabase = await createClient();

  // Traer solo semestres activos y sus asignaturas
  const { data: rawSemesters } = await supabase
    .from("semesters")
    .select("*, subjects(*)") 
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Convertimos y filtramos
  // IMPORTANTE: Filtramos semestres que NO tengan asignaturas para que no se vean vacíos
  const semestersList = (rawSemesters as unknown as Semester[])?.filter(
    (sem) => sem.subjects && sem.subjects.length > 0
  ) || [];

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Header con animación */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/10 mb-4 ring-1 ring-secondary/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <Library className="w-6 h-6 text-secondary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white">
          Centro de <span className="text-secondary">Recursos</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-light">
          Material docente, grabaciones y guías de estudio para asignaturas activas.
        </p>
      </div>

      {/* Grid de Semestres */}
      <div className="grid gap-16">
        {semestersList.length > 0 ? (
          semestersList.map((semester) => (
            <div key={semester.id} className="space-y-6 animate-in fade-in duration-1000">
              
              {/* Título del Semestre con decoración */}
              <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <div className="p-2 bg-white/5 rounded-lg">
                    <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">{semester.name}</h2>
              </div>

              {/* Grid de Asignaturas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semester.subjects.map((subject) => (
                  <Link key={subject.id} href={`/courses/${subject.id}`} className="group h-full">
                    <Card className="h-full p-6 border-white/5 bg-surface/40 hover:bg-surface/60 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                      
                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 rounded-xl bg-background border border-white/10 group-hover:border-secondary/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] transition-all">
                            <BookOpen className="w-6 h-6 text-secondary" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/10 px-2 py-1 rounded border border-secondary/20">
                            {subject.code}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                          {subject.name}
                        </h3>
                        <p className="text-sm text-text-muted mb-6 line-clamp-2">
                          Accede a guías, códigos de ejemplo y grabaciones.
                        </p>

                        <div className="mt-auto flex items-center text-xs font-bold text-secondary uppercase tracking-wider group/link">
                          Ver Material 
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Estado Vacío (Mejorado)
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
              <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                  <GraduationCap className="w-8 h-8 text-text-muted opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-white">No hay cursos activos</h3>
              <p className="text-text-muted max-w-md mx-auto mt-2">
                  Actualmente no hay semestres o asignaturas visibles para el público. Revisa más tarde.
              </p>
          </div>
        )}
      </div>
    </div>
  );
}