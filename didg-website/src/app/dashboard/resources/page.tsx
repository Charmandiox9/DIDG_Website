import { createClient } from "@/infrastructure/supabase/server";
import { AdminResourceList } from "@/components/dashboard/AdminResourceList";
import { Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function AdminResourcesPage() {
  const supabase = await createClient();

  // Obtenemos los recursos directo de la DB
  const { data: resources } = await supabase
    .from("extra_resources")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-main flex items-center gap-3">
            Gestión de Recursos <Sparkles className="w-6 h-6 text-primary" />
        </h1>
        <p className="text-text-muted font-mono mt-2">Administra la base de conocimiento y material extra.</p>
      </div>

      {/* Componente Interactivo */}
      <AdminResourceList resources={resources || []} />

    </div>
  );
}