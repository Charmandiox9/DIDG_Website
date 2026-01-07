import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AyudantiaList } from "@/components/courses/AyudantiaList";

const getFileUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/materials/${path}`;
};

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
    // .order("date", { ascending: false });

  if (!subject) return <div className="p-20 text-center text-white">Asignatura no encontrada</div>;

  const s = subject as any;
  const ayus_list = (ayudantias as any[])?.sort((a, b) => {
    // 1. PRIMERO: Comparamos Fechas (Descendente: lo más nuevo arriba)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    // Si las fechas son distintas, gana la fecha más reciente (b - a)
    if (dateB !== dateA) {
      return dateB - dateA; 
    }

    // 2. SEGUNDO: Si es la MISMA fecha (empate), desempatamos por Título "Humano"
    // 'numeric: true' hace que "Ayudantía 10" vaya antes que "Ayudantía 2" en orden descendente
    return b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto animate-in fade-in duration-500">

      {/* 2. AGREGAR BREADCRUMBS AQUÍ (Antes del Header) */}
      <Breadcrumbs 
        items={[
          { label: "Cursos", href: "/courses" },
          { label: s.name } // El último no lleva href
        ]} 
      />
      
      {/* Header */}
      <div className="mb-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span className="text-secondary font-mono text-sm mb-2 block">{s.semesters?.name} — {s.code}</span>
                <h1 className="text-4xl font-display font-bold text-white">{s.name}</h1>
            </div>
        </div>
      </div>

      {/* Timeline de Ayudantías */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
        
        <AyudantiaList ayudantias={ayus_list} />
        
        {ayus_list.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                No hay ayudantías registradas aún.
            </div>
        )}

      </div>
    </div>
  );
}