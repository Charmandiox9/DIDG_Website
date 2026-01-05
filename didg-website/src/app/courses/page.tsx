import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, Library } from "lucide-react";
import { Card } from "@/components/ui/card";

export const revalidate = 60; // Revalidar cada minuto

export default async function PublicCoursesPage() {
  const supabase = await createClient();

  // Traer solo semestres activos
  const { data: semesters } = await supabase
    .from("semesters")
    .select("*, subjects(*)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const semestersList = semesters as any[];

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-secondary/10 mb-4 ring-1 ring-secondary/30">
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
      <div className="grid gap-12">
        {semestersList?.map((semester) => (
          <div key={semester.id} className="space-y-6">
            <div className="flex items-center gap-4 border-b border-white/10 pb-2">
              <Calendar className="w-5 h-5 text-text-muted" />
              <h2 className="text-2xl font-bold text-white">{semester.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {semester.subjects?.map((subject) => (
                <Link key={subject.id} href={`/courses/${subject.id}`} className="group">
                  <Card className="h-full p-6 border-white/5 bg-surface/40 hover:border-secondary/50 transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 rounded bg-background border border-white/10 group-hover:border-secondary/50 transition-colors">
                        <BookOpen className="w-6 h-6 text-secondary" />
                      </div>
                      <span className="text-xs font-mono text-text-muted bg-white/5 px-2 py-1 rounded">
                        {subject.code}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-sm text-text-muted mb-6">
                      Accede a guías, códigos de ejemplo y grabaciones de clases.
                    </p>

                    <div className="flex items-center text-xs font-bold text-secondary uppercase tracking-wider">
                      Ver Material <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
        
        {(!semestersList || semestersList?.length === 0) && (
            <div className="text-center text-text-muted py-10">
                No hay asignaturas activas disponibles en este momento.
            </div>
        )}
      </div>
    </div>
  );
}