import { createClient } from "@/infrastructure/supabase/server";
import { StudentRegisterForm } from "@/components/dashboard/StudentRegisterForm";
import { StudentsTable } from "@/components/dashboard/StudentsTable";
import { Users } from "lucide-react";

export default async function StudentsPage() {
  const supabase = await createClient();

  // Opcional: Traer la lista de estudiantes para mostrarla al lado
  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-display font-bold text-white">Gestión de Estudiantes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Lista de estudiantes (Solo visualización rápida) */}
        <div className="lg:col-span-2 space-y-4">
           <h2 className="text-xl font-bold text-white">Listado de Alumnos</h2>
           {/* Aquí podrías iterar sobre 'students' para mostrarlos en una tabla */}
           <StudentsTable students={students || []} />
        </div>

        {/* COLUMNA DERECHA: El formulario que creamos */}
        <div>
          <StudentRegisterForm />
        </div>

      </div>
    </div>
  );
}