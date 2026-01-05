import { createClient } from "@/infrastructure/supabase/server";
import { DownloadButton } from "@/components/courses/DownloadButton";
import Link from "next/link";
import { ArrowLeft, Video, Calendar, Clock, FileText } from "lucide-react";

export default async function PublicSubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const supabase = await createClient();
  const { subjectId } = await params;

  // 1. Info Asignatura
  const { data: subject } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .eq("id", subjectId)
    .single();

  // 2. Ayudantías
  const { data: ayudantias } = await supabase
    .from("ayudantias")
    .select("*")
    .eq("subject_id", subjectId)
    .order("date", { ascending: false });

  if (!subject) return <div className="p-20 text-center text-white">Asignatura no encontrada</div>;

  // --- ZONA DE PARCHES PARA TYPESCRIPT ---
  // Convertimos las respuestas a 'any' para evitar errores de compilación estrictos
  const s = subject as any;
  const ayus_list = ayudantias as any[]; // <--- ESTO ARREGLA EL ERROR NUEVO

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                {/* Usamos la variable 's' */}
                <span className="text-secondary font-mono text-sm mb-2 block">{s.semesters?.name} — {s.code}</span>
                <h1 className="text-4xl font-display font-bold text-white">{s.name}</h1>
            </div>
        </div>
      </div>

      {/* Timeline de Ayudantías */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        
        {/* USAMOS 'ayus_list' EN LUGAR DE 'ayudantias' */}
        {ayus_list?.map((ayu) => (
          <div key={ayu.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            
            {/* Icono Central */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-secondary">
              <Calendar className="w-5 h-5" />
            </div>
            
            {/* Tarjeta de Contenido */}
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-xl border border-white/10 bg-surface/40 hover:border-secondary/30 transition-all shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <time className="font-mono text-xs text-text-muted">{new Date(ayu.date).toLocaleDateString()}</time>
                {ayu.video_url && <Video className="w-4 h-4 text-red-400" />}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{ayu.title}</h3>
              <p className="text-sm text-text-muted mb-4">{ayu.description}</p>
              
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                {/* Botón de Descarga Seguro */}
                {ayu.material_url ? (
                  <DownloadButton filePath={ayu.material_url} />
                ) : (
                  <span className="text-xs text-text-muted italic flex items-center gap-1">
                    <FileText className="w-3 h-3" /> Sin material adjunto
                  </span>
                )}

                {/* Enlace a Video */}
                {ayu.video_url && (
                  <a 
                    href={ayu.video_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-white/5 rounded hover:bg-white/10 transition-all border border-white/5"
                  >
                    <Video className="w-3 h-3" /> Ver Grabación
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {ayus_list?.length === 0 && (
            <div className="text-center py-20 text-text-muted bg-surface/20 rounded-xl border border-dashed border-white/10 relative z-10">
                Aún no se ha subido contenido para esta asignatura.
            </div>
        )}
      </div>
    </div>
  );
}