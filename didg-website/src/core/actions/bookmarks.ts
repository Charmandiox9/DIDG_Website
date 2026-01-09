"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Alternar Favorito (Like / Dislike)
export async function toggleBookmark(resourceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { ok: false, message: "No autenticado" };

  // Verificar si ya existe
  const { data: existing } = await supabase
    .from("resource_bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .eq("resource_id", resourceId)
    .single();

  if (existing) {
    // Si existe, lo borramos (Dislike)
    await supabase
      .from("resource_bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_id", resourceId);
  } else {
    // Si no existe, lo creamos (Like)
    await supabase
      .from("resource_bookmarks")
      // @ts-ignore: Temporary fix for missing table definition in types
      .insert({ user_id: user.id, resource_id: resourceId });
  }

  // Revalidamos para que la UI se actualice
  revalidatePath("/resources");
  revalidatePath("/profile");
  return { ok: true, isBookmarked: !existing };
}

// 2. Obtener Biblioteca Personal (Para el perfil)
export async function getUserBookmarks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Hacemos un join para traer los datos del recurso
  const { data } = await supabase
    .from("resource_bookmarks")
    .select(`
      resource_id,
      extra_resources (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Limpiamos la data para devolver solo el array de recursos
  return data?.map((item: any) => item.extra_resources) || [];
}