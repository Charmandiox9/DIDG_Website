import { createClient } from "@/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { GraduationCap, BookOpen } from "lucide-react";

export default async function StudentGradesPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Obtener asignaturas inscritas + Notas
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      id,
      subjects (
        name,
        code
      ),
      grades (
        name,
        score,
        weight
      )
    `)
    .eq("student_id", user.id);

  return (
    <div className="min-h-screen py-20 px-4 max-w-5xl mx-auto animate-in fade-in">
      
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-secondary/10 rounded-full text-secondary">
          <GraduationCap className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Mis Calificaciones</h1>
          <p className="text-text-muted">Resumen académico personal.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {enrollments?.map((item: any) => {
          // Calcular promedio simple (puedes mejorar esto con ponderaciones)
          const totalGrades = item.grades.length;
          const sum = item.grades.reduce((acc: number, g: any) => acc + g.score, 0);
          const average = totalGrades > 0 ? (sum / totalGrades).toFixed(1) : "-";

          return (
            <div key={item.id} className="bg-surface/40 border border-white/10 rounded-xl overflow-hidden">
              {/* Cabecera Asignatura */}
              <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-text-muted" />
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.subjects.name}</h3>
                    <span className="text-xs font-mono text-text-muted">{item.subjects.code}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted block uppercase">Promedio Actual</span>
                  <span className={`text-xl font-bold font-mono ${Number(average) >= 4.0 ? 'text-emerald-400' : 'text-error'}`}>
                    {average}
                  </span>
                </div>
              </div>

              {/* Tabla de Notas */}
              <div className="p-4">
                {item.grades.length === 0 ? (
                  <p className="text-sm text-text-muted italic">No hay notas registradas aún.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {item.grades.map((grade: any, idx: number) => (
                      <div key={idx} className="bg-background/50 p-3 rounded border border-white/5 flex flex-col items-center">
                        <span className="text-xs text-text-muted mb-1 text-center truncate w-full" title={grade.name}>
                            {grade.name}
                        </span>
                        <span className="font-display font-bold text-lg text-white">
                            {grade.score}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {enrollments?.length === 0 && (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
            <p className="text-text-muted">No estás inscrito en ninguna asignatura actualmente.</p>
          </div>
        )}
      </div>
    </div>
  );
}