import { createClient } from "@/infrastructure/supabase/server";
import { createAyudantia, deleteAyudantia } from "@/core/actions/ayudantias";
import Link from "next/link";
import { ArrowLeft, FileText, Video, Calendar, Upload, Trash2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AyudantiaForm } from "@/components/dashboard/AyudantiaForm";

export default async function SubjectDetailPage({ params }: { params: { subjectId: string } }) {
  const supabase = await createClient();
  const { subjectId } = await params;

  // 1. Obtener info de la asignatura
  const { data: subject } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .eq("id", subjectId)
    .single();

  if (!subject) return <div>Asignatura no encontrada</div>;

  // 2. Obtener Ayudantías de esta asignatura
  const { data: ayudantias } = await supabase
    .from("ayudantias")
    .select("*")
    .eq("subject_id", subjectId)
    .order("date", { ascending: false });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      
      {/* Header con Navegación */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/courses" className="p-2 rounded hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-bold text-white">{subject.name}</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
              {subject.semesters?.name}
            </span>
          </div>
          <p className="text-text-muted font-mono text-sm">{subject.code} — Gestión de Contenido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: LISTA DE AYUDANTÍAS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Ayudantías Realizadas</h2>
          
          {ayudantias?.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-text-muted">
              No hay contenido subido aún. Usa el formulario de la derecha.
            </div>
          ) : (
            ayudantias?.map((ayu) => (
              <Card key={ayu.id} className="p-4 flex flex-col sm:flex-row gap-4 group hover:border-primary/40 transition-colors">
                {/* Fecha Box */}
                <div className="flex flex-col items-center justify-center p-3 bg-white/5 rounded border border-white/5 min-w-[80px]">
                  <Calendar className="w-4 h-4 text-primary mb-1" />
                  <span className="text-xs font-mono text-text-muted">{new Date(ayu.date).toLocaleDateString()}</span>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">{ayu.title}</h3>
                  <p className="text-sm text-text-muted mb-3">{ayu.description || "Sin descripción"}</p>
                  
                  {/* Badges de recursos */}
                  <div className="flex gap-2">
                    {ayu.material_url && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <FileText className="w-3 h-3" /> Archivo Adjunto
                      </span>
                    )}
                    {ayu.video_url && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        <Video className="w-3 h-3" /> Grabación
                      </span>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-start">
                    <form action={deleteAyudantia.bind(null, ayu.id, subjectId)}>
                        <button className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded transition-colors" title="Eliminar">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </form>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE SUBIDA */}
        <div>
          {/* Reemplazamos todo el HTML del form anterior por esto: */}
           <AyudantiaForm subjectId={subjectId} />
        </div>

      </div>
    </div>
  );
}