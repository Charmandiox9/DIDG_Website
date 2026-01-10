import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Library, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CharmanderPet } from "@/components/home/CharmanderPet";
import type { Metadata } from "next";

export const revalidate = 60; 

export const metadata: Metadata = {
  title: "Recursos y Ayudantías | Daniel Durán",
  description: "Material docente, guías de estudio y recursos para estudiantes de Ingeniería Civil Informática.",
  openGraph: {
    title: "Centro de Recursos - Daniel Durán",
    description: "Accede a material de estudio para tus asignaturas.",
  }
};

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

  const { data: rawSemesters } = await supabase
    .from("semesters")
    .select("*, subjects(*)") 
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const semestersList = (rawSemesters as unknown as Semester[])?.filter(
    (sem) => sem.subjects && sem.subjects.length > 0
  ) || [];

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      <CharmanderPet />
      
      {/* Hero Header */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/10 mb-4 ring-1 ring-secondary/30 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
          <Library className="w-6 h-6 text-secondary" />
        </div>
        
        {/* Título Adaptable */}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-main">
          Centro de <span className="text-secondary drop-shadow-[0_0_10px_rgba(124,58,237,0.3)]">Recursos</span>
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
              
              {/* Título del Semestre */}
              <div className="flex items-center gap-4 border-b border-text-main/10 pb-4">
                <div className="p-2 bg-surface rounded-lg shadow-sm border border-text-main/5">
                    <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <h2 className="text-2xl font-bold text-text-main tracking-tight">
                    {semester.name}
                </h2>
              </div>

              {/* Grid de Asignaturas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {semester.subjects.map((subject) => (
                  <Link key={subject.id} href={`/courses/${subject.id}`} className="group h-full">
                    <Card className="h-full p-6 border-text-main/10 bg-surface/50 hover:bg-surface hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden backdrop-blur-sm shadow-sm hover:shadow-lg hover:shadow-secondary/10">
                      
                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          {/* Icon Box */}
                          <div className="p-3 rounded-xl bg-background border border-text-main/10 group-hover:border-secondary/50 group-hover:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all">
                            <BookOpen className="w-6 h-6 text-secondary" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-secondary bg-secondary/10 px-2 py-1 rounded border border-secondary/20">
                            {subject.code}
                          </span>
                        </div>
                        
                        {/* Título de la asignatura */}
                        <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-secondary transition-colors line-clamp-2">
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
          <div className="text-center py-20 border border-dashed border-text-main/10 rounded-2xl bg-surface/30">
              <div className="inline-flex p-4 rounded-full bg-text-main/5 mb-4">
                  <GraduationCap className="w-8 h-8 text-text-muted opacity-50" />
              </div>
              <h3 className="text-lg font-bold text-text-main">No hay cursos activos</h3>
              <p className="text-text-muted max-w-md mx-auto mt-2">
                  Actualmente no hay semestres o asignaturas visibles para el público. Revisa más tarde.
              </p>
          </div>
        )}
      </div>
    </div>
  );
}