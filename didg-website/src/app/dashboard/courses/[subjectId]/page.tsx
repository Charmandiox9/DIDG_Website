import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AyudantiaForm } from "@/components/dashboard/AyudantiaForm";
// import { AyudantiaCard } from "@/components/dashboard/AyudantiaCard"; // <--- YA NO LO NECESITAMOS DIRECTAMENTE
import { AdminAyudantiaList } from "@/components/dashboard/AdminAyudantiaList"; // <--- USAMOS LA LISTA INTELIGENTE

// Ajuste de tipo para Next.js reciente
export default async function SubjectDetailPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const supabase = await createClient();
  const { subjectId } = await params;

  // 1. Obtener Asignatura
  const { data: subject } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .eq("id", subjectId)
    .single();

  if (!subject) return <div>Asignatura no encontrada</div>;

  // 2. Obtener Ayudantías (Sin ordenamiento estricto de SQL para hacerlo mejor en JS)
  const { data: ayudantias } = await supabase
    .from("ayudantias")
    .select("*")
    .eq("subject_id", subjectId);
    // .order("date", { ascending: false }); // Lo hacemos abajo mejor

  const s = subject as any;

  // 3. ORDENAMIENTO HÍBRIDO (Igual que en la vista pública)
  // Arregla el problema de "Día 10 vs Día 2" y ordena por fecha primero.
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
        <Link href="/dashboard/courses" className="p-2 rounded hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-bold text-white">{s.name}</h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
              {s.semesters?.name}
            </span>
          </div>
          <p className="text-text-muted font-mono text-sm">{s.code} — Gestión de Contenido</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: LISTA CON BUSCADOR */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Ayudantías Realizadas</h2>
          
          {/* AQUI ESTÁ EL CAMBIO PRINCIPAL */}
          {/* Reemplazamos el mapeo manual por el componente AdminAyudantiaList */}
          {/* Este componente ya maneja el estado vacío, el buscador y renderiza las Cards */}
          <AdminAyudantiaList 
            ayudantias={sortedAyus || []} 
            subjectId={subjectId} 
          />
          
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE CREACIÓN */}
        <div className="sticky top-8 h-fit"> {/* Sticky para que el formulario te siga al hacer scroll */}
           <AyudantiaForm subjectId={subjectId} />
        </div>

      </div>
    </div>
  );
}