"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function signOutAction() {
  const supabase = await createClient();
  
  // 1. Cerrar sesión en Supabase
  await supabase.auth.signOut();

  // 2. Limpiar caché para que el Navbar se actualice
  revalidatePath("/", "layout");

  // 3. Redirigir al Login
  redirect("/login");
}