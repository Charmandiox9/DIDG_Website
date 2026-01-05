import { createClient } from "@/infrastructure/supabase/server";
import { createSemester, createSubject, toggleSemesterStatus, deleteSubject } from "@/core/actions/academic";
// Agregamos FileSpreadsheet a los iconos
import { Plus, Book, Calendar, Trash2, FileSpreadsheet } from "lucide-react"; 
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default async function CoursesDashboard() {
  const supabase = await createClient();

  const { data: semesters } = await supabase
    .from("semesters")
    .select("*, subjects(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Gestión Académica</h1>
          <p className="text-text-muted font-mono text-sm">Organiza semestres y materias.</p>
        </div>
        
        <form action={createSemester} className="flex gap-2 bg-surface/50 p-2 rounded border border-white/10">
          <input name="name" placeholder="Nuevo Semestre (Ej: 2024-2)" required className="bg-transparent text-white text-sm px-2 focus:outline-none font-mono" />
          <button type="submit" className="bg-primary/20 hover:bg-primary/40 text-primary p-2 rounded transition-colors">
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* LISTA DE SEMESTRES */}
      <div className="grid gap-6">
        {semesters?.map((semester) => (
          <div key={semester.id} className={`relative border-l-2 pl-6 py-2 ${semester.is_active ? 'border-primary' : 'border-white/10 opacity-70'}`}>
            
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-text-muted" />
                {semester.name}
              </h2>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${semester.is_active ? 'bg-primary text-background' : 'bg-white/10 text-text-muted'}`}>
                {semester.is_active ? 'Activo' : 'Archivado'}
              </span>
              <form action={toggleSemesterStatus.bind(null, semester.id, semester.is_active || false)}>
                 <button className="text-xs text-text-muted hover:text-white underline decoration-dashed">
                    {semester.is_active ? 'Archivar' : 'Activar'}
                 </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* CREAR ASIGNATURA */}
              <Card className="border-dashed border-white/20 bg-transparent flex flex-col justify-center p-4">
                 <p className="text-xs font-mono text-text-muted mb-2 uppercase">Añadir Asignatura</p>
                 <form action={createSubject} className="space-y-2">
                    <input type="hidden" name="semester_id" value={semester.id} />
                    <input name="name" placeholder="Nombre" className="w-full bg-surface/50 text-xs p-2 rounded text-white border border-white/5" required />
                    <div className="flex gap-2">
                        <input name="code" placeholder="Cód" className="w-1/2 bg-surface/50 text-xs p-2 rounded text-white border border-white/5 font-mono" required />
                        <button type="submit" className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs rounded font-bold transition-colors">Crear</button>
                    </div>
                 </form>
              </Card>

              {/* ASIGNATURAS */}
              {semester.subjects?.map((subject) => (
                <Card key={subject.id} className="group hover:border-primary/30 transition-colors relative">
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 rounded bg-secondary/10 text-secondary">
                            <Book className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-text-muted bg-white/5 px-1.5 py-0.5 rounded">{subject.code}</span>
                            <form action={deleteSubject.bind(null, subject.id)}>
                                <button type="submit" className="text-text-muted hover:text-red-500 transition-colors p-1" title="Eliminar">
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </form>
                        </div>
                    </div>

                    <h3 className="font-bold text-white group-hover:text-primary transition-colors mb-4">
                        {subject.name}
                    </h3>
                    
                    {/* --- ZONA DE ACCIONES ACTUALIZADA --- */}
                    <div className="flex gap-2">
                        {/* Botón 1: Subir Notas (NUEVO) */}
                        <Link 
                            href={`/dashboard/grades?subject_id=${subject.id}`}
                            className="flex-1 flex items-center justify-center gap-2 text-xs py-2 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
                            title="Cargar Notas Masivas"
                        >
                            <FileSpreadsheet className="w-3 h-3" />
                            Notas
                        </Link>

                        {/* Botón 2: Gestionar Ayudantías */}
                        <Link 
                            href={`/dashboard/courses/${subject.id}`}
                            className="flex-[2] text-xs py-2 rounded bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors text-center border border-white/5"
                        >
                            Ver Ayudantías
                        </Link>
                    </div>

                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {semesters?.length === 0 && (
            <div className="text-center py-10 text-text-muted font-mono">No hay semestres registrados.</div>
        )}
      </div>
    </div>
  );
}