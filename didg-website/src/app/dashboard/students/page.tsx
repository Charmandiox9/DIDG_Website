import { createClient } from "@/infrastructure/supabase/server";
import { StudentRegisterForm } from "@/components/dashboard/StudentRegisterForm";
import { StudentsTable } from "@/components/dashboard/StudentsTable";
import { Users } from "lucide-react";

export default async function StudentsPage() {
  const supabase = await createClient();

  // Traer la lista de estudiantes
  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        {/* Título adaptable */}
        <h1 className="text-3xl font-display font-bold text-text-main">Gestión de Estudiantes</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUMNA IZQUIERDA: Tabla */}
        <div className="lg:col-span-2 space-y-4">
           {/* Subtítulo adaptable */}
           <h2 className="text-xl font-bold text-text-main">Listado de Alumnos</h2>
           <StudentsTable students={students || []} />
        </div>

        {/* COLUMNA DERECHA: Formulario */}
        <div>
          <StudentRegisterForm />
        </div>

      </div>
    </div>
  );
}