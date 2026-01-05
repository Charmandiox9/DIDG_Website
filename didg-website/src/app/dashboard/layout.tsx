import { redirect } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/server";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Verificar Usuario (Usamos getUser que es más seguro que getSession)
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  // 2. Verificar Rol de Admin en la tabla profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userProfile = profile as any;

  // Si no hay perfil o el rol no es admin, fuera.
  if (!userProfile || userProfile.role !== "admin") {
    // Opcional: Podrías redirigir a una página de "No autorizado"
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      {/* Ajustamos el margen para móviles y escritorio */}
      <main className="flex-1 md:ml-64 p-8 min-h-screen overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}