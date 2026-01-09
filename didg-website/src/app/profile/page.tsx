import { createClient } from "@/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CharmanderPet } from "@/components/home/CharmanderPet";
import { ProfileTabs } from "@/components/profile/ProfileTabs"; // <--- Importamos el nuevo componente
import { getUserBookmarks } from "@/core/actions/bookmarks";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Verificar Sesión
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Obtener datos del perfil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const bookmarks = await getUserBookmarks();

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 max-w-5xl mx-auto animate-in fade-in">
      {/* Mascota y Breadcrumbs se mantienen globales */}
      <CharmanderPet />
      
      <Breadcrumbs items={[{ label: "Mi Perfil" }]} />

      <div className="mt-8">
        {/* Renderizamos el componente cliente con las pestañas */}
        <ProfileTabs profile={profile} email={user.email} bookmarks={bookmarks} />
      </div>

    </div>
  );
}