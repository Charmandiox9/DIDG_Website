import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AyudantiaList } from "@/components/courses/AyudantiaList";
import { CharmanderPet } from "@/components/home/CharmanderPet";

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
    .eq("subject_id", subjectId);

  // Fallback si no existe (text-white -> text-text-main)
  if (!subject) return <div className="p-20 text-center text-text-main">Asignatura no encontrada</div>;

  const s = subject as any;
  const ayus_list = (ayudantias as any[])?.sort((a, b) => {
    // 1. PRIMERO: Comparamos Fechas (Descendente)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (dateB !== dateA) {
      return dateB - dateA; 
    }

    // 2. SEGUNDO: Desempate por Título
    return b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      <CharmanderPet />

      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: "Cursos", href: "/courses" },
          { label: s.name } 
        ]} 
      />
      
      {/* Header */}
      <div className="mb-12">
        <Link href="/courses" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <span className="text-secondary font-mono text-sm mb-2 block">{s.semesters?.name} — {s.code}</span>
                {/* Título adaptable */}
                <h1 className="text-4xl font-display font-bold text-text-main">{s.name}</h1>
            </div>
        </div>
      </div>

      {/* Timeline de Ayudantías */}
      {/* CAMBIO CLAVE EN LA LÍNEA VERTICAL (before):
          - via-white/10 --> via-text-main/10
          Esto asegura que la línea vertical se vea gris en Light Mode y blanca en Dark Mode.
      */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-text-main/10 before:to-transparent">
        
        <AyudantiaList 
          ayudantias={ayus_list} 
          subjectName={s.name}
        />
        
        {ayus_list.length === 0 && (
            // Estado vacío adaptable
            <div className="text-center py-20 bg-surface/50 rounded-xl border border-dashed border-text-main/10 text-text-muted">
                No hay ayudantías registradas aún.
            </div>
        )}

      </div>
    </div>
  );
}