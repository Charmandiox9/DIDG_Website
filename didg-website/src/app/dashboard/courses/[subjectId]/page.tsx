import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AyudantiaForm } from "@/components/dashboard/AyudantiaForm";
import { AdminAyudantiaList } from "@/components/dashboard/AdminAyudantiaList"; 

export default async function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const supabase = await createClient();
  const { subjectId } = await params;

  // 1. Obtener Asignatura
  const { data: subject } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .eq("id", subjectId)
    .single();

  if (!subject) return <div className="p-8 text-center text-text-muted">Asignatura no encontrada</div>;

  // 2. Obtener Ayudantías
  const { data: ayudantias } = await supabase
    .from("ayudantias")
    .select("*")
    .eq("subject_id", subjectId);

  const s = subject as any;

  // 3. ORDENAMIENTO HÍBRIDO
  const sortedAyus = (ayudantias as any[])?.sort((a, b) => {
    // A. Primero por Fecha (Descendente)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    if (dateB !== dateA) {
      return dateB - dateA; 
    }

    // B. Desempate por Título Numérico (Descendente)
    return b.title.localeCompare(a.title, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
            href="/dashboard/courses" 
            // Botón adaptable: hover gris en light / hover blanco en dark
            className="p-2 rounded hover:bg-text-main/5 text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            {/* Título adaptable */}
            <h1 className="text-3xl font-display font-bold text-text-main">{s.name}</h1>
            
            {/* Badge adaptable: bg-primary/10 se ve bien en ambos */}
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
              {s.semesters?.name}
            </span>
          </div>
          <p className="text-text-muted font-mono text-sm">{s.code} — Gestión de Contenido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: LISTA CON BUSCADOR */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-text-main mb-4">Ayudantías Realizadas</h2>
          
          <AdminAyudantiaList 
            ayudantias={sortedAyus || []} 
            subjectId={subjectId} 
          />
          
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE CREACIÓN */}
        <div className="sticky top-8 h-fit"> 
           {/* El formulario (AyudantiaForm) debe tener bg-surface para contrastar aquí */}
           <AyudantiaForm subjectId={subjectId} />
        </div>

      </div>
    </div>
  );
}