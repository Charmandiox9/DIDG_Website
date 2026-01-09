"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";

// 1. Toggle (Like/Dislike)
export async function toggleAyudantiaBookmark(ayudantiaId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { ok: false };

  const { data: existing } = await supabase
    .from("ayudantia_bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .eq("ayudantia_id", ayudantiaId)
    .single();

  if (existing) {
    await supabase.from("ayudantia_bookmarks").delete().eq("user_id", user.id).eq("ayudantia_id", ayudantiaId);
  } else {
    // @ts-ignore: Temporary fix for missing table definition in types
    await supabase.from("ayudantia_bookmarks").insert({ user_id: user.id, ayudantia_id: ayudantiaId });
  }

  // Revalidamos rutas donde aparecen ayudantías
  revalidatePath("/courses/[subjectId]", "page"); 
  revalidatePath("/profile");
  return { ok: true, isBookmarked: !existing };
}

// 2. Obtener Favoritos (Con datos de la asignatura para mostrar contexto)
export async function getUserAyudantiaBookmarks() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Obtenemos la ayudantía Y el nombre de la asignatura (relación)
  const { data } = await supabase
    .from("ayudantia_bookmarks")
    .select(`
      ayudantia_id,
      ayudantias (
        *,
        subjects (name, code)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data?.map((item: any) => item.ayudantias) || [];
}