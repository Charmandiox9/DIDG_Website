import { createAdminClient } from "@/infrastructure/supabase/admin";
import { UploadGradesForm } from "@/components/dashboard/UploadGradesForm";
import { FileSpreadsheet, History, User, Search, AlertTriangle } from "lucide-react";

export default async function GradesDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ subject_id?: string }>;
}) {
  const supabase = createAdminClient();
  const { subject_id } = await searchParams;

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name, code")
    .order("name");

  let recentGrades: any[] = [];
  let selectedSubjectName = "";
  let warningMessage = "";

  if (subject_id) {
    const sub = subjects?.find((s) => s.id === subject_id);
    selectedSubjectName = sub ? sub.name : "Asignatura Desconocida";

    // PASO A: Buscar matrículas
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("id, student_id")
        .eq("subject_id", subject_id);
    
    const enrollmentIds = enrollments?.map(e => e.id) || [];

    if (enrollmentIds.length > 0) {
        // PASO B: Buscar Notas
        const { data: grades } = await supabase
            .from("grades")
            .select("*")
            .in("enrollment_id", enrollmentIds)
            .order("created_at", { ascending: false })
            .limit(50);
        
        if (grades && grades.length > 0) {
            // PASO C: Buscar Perfiles
            // CORRECCIÓN CRÍTICA: Solo pedimos columnas que SÍ existen (quitamos 'email')
            const studentIds = enrollments?.map(e => e.student_id).filter(Boolean) || [];
            
            const { data: profiles } = await supabase
                .from("profiles")
                .select("id, rut, full_name") // <--- Solo lo que existe en tu tabla
                .in("id", studentIds);

            // PASO D: Unir datos
            recentGrades = grades.map(grade => {
                const enrollment = enrollments?.find(e => e.id === grade.enrollment_id);
                // Aseguramos que los IDs sean strings para comparar bien
                const profile = profiles?.find(p => String(p.id) === String(enrollment?.student_id));

                return {
                    ...grade,
                    student_rut: profile?.rut || "RUT No encontrado",
                    // Mostramos el nombre en lugar del email, ya que el email no está en la tabla
                    student_name: profile?.full_name || "Nombre desconocido"
                };
            });
        }
    } else {
        warningMessage = "No hay alumnos inscritos en esta asignatura.";
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Centro de Calificaciones</h1>
          <p className="text-text-muted font-mono text-sm">Gestiona y publica las notas de tus alumnos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* IZQUIERDA: FORMULARIO */}
        <div>
           <div className="bg-surface/50 border border-white/10 rounded-xl overflow-hidden">
             <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-bold text-white text-sm uppercase tracking-wider">Nueva Carga</h3>
             </div>
             <div className="p-4">
                <UploadGradesForm subjects={subjects || []} defaultSubjectId={subject_id} />
             </div>
           </div>
        </div>

        {/* DERECHA: TABLA */}
        <div>
          {subject_id ? (
            <div className="bg-surface/30 border border-white/10 rounded-xl overflow-hidden flex flex-col h-full max-h-[600px]">
              <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-secondary" />
                  Historial: <span className="text-secondary">{selectedSubjectName}</span>
                </h3>
                <span className="text-xs text-text-muted font-mono bg-black/20 px-2 py-1 rounded">
                  {recentGrades.length} registros
                </span>
              </div>
              
              <div className="overflow-y-auto flex-1 p-0">
                {recentGrades.length === 0 ? (
                  <div className="p-10 flex flex-col items-center justify-center text-text-muted text-sm gap-2">
                    {warningMessage ? (
                         <>
                            <AlertTriangle className="w-8 h-8 text-yellow-500/50" />
                            <p className="text-yellow-200/80">{warningMessage}</p>
                         </>
                    ) : (
                         <>
                            <Search className="w-8 h-8 opacity-20" />
                            <p>No hay notas registradas.</p>
                         </>
                    )}
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-surface/95 backdrop-blur text-xs font-mono text-text-muted uppercase z-10">
                      <tr>
                        <th className="p-3 border-b border-white/10">Alumno</th>
                        <th className="p-3 border-b border-white/10">Evaluación</th>
                        <th className="p-3 border-b border-white/10 text-right">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {recentGrades.map((grade) => (
                        <tr key={grade.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-text-muted group-hover:text-primary transition-colors" />
                              <span className={`font-mono text-xs ${grade.student_rut.includes("No encontrado") ? 'text-red-400' : 'text-white'}`}>
                                {grade.student_rut}
                              </span>
                            </div>
                            <div className="text-[10px] text-text-muted ml-5 truncate max-w-[150px]">
                               {/* Ahora mostramos el nombre completo */}
                               {grade.student_name}
                            </div>
                          </td>
                          <td className="p-3 text-text-muted">
                            {grade.name}
                          </td>
                          <td className="p-3 text-right">
                            <span className={`font-bold font-mono px-2 py-1 rounded ${grade.score >= 4.0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                              {grade.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-surface/30 border border-dashed border-white/10 p-8 rounded-xl text-center flex flex-col items-center justify-center gap-4 h-full min-h-[300px]">
              <div className="p-4 bg-white/5 rounded-full">
                <FileSpreadsheet className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-white">Selecciona una Asignatura</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}