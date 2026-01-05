import { createClient } from "@/infrastructure/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AyudantiaForm } from "@/components/dashboard/AyudantiaForm";
import { AyudantiaCard } from "@/components/dashboard/AyudantiaCard"; // Importamos el nuevo componente

export default async function SubjectDetailPage({ params }: { params: { subjectId: string } }) {
  const supabase = await createClient();
  const { subjectId } = await params;

  const { data: subject } = await supabase
    .from("subjects")
    .select("*, semesters(name)")
    .eq("id", subjectId)
    .single();

  if (!subject) return <div>Asignatura no encontrada</div>;

  const { data: ayudantias } = await supabase
    .from("ayudantias")
    .select("*")
    .eq("subject_id", subjectId)
    .order("date", { ascending: false });

  const s = subject as any;
  const ayus = (ayudantias || []) as any[];

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      
      {/* Header (igual que antes) */}
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
        
        {/* COLUMNA IZQUIERDA: LISTA */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Ayudantías Realizadas</h2>
          
          {ayudantias?.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-text-muted">
              No hay contenido subido aún. Usa el formulario de la derecha.
            </div>
          ) : (
            ayus?.map((ayu) => (
              // Usamos el nuevo componente inteligente que maneja la edición/borrado
              <AyudantiaCard key={ayu.id} ayu={ayu} subjectId={subjectId} />
            ))
          )}
        </div>

        {/* COLUMNA DERECHA: FORMULARIO DE CREACIÓN */}
        <div>
           {/* Sin initialData, funciona en modo creación */}
           <AyudantiaForm subjectId={subjectId} />
        </div>

      </div>
    </div>
  );
}