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
  redirect("/");
}

export async function login(email: string, password: string) {
  const supabase = await createClient();

  // Intentamos iniciar sesión con lo que sea que nos mandó el formulario
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Retornamos el error para mostrarlo en el frontend
    return { error: error.message };
  }

  // Si sale bien, revalidamos y redirigimos
  revalidatePath("/", "layout");
  redirect("/dashboard"); // O '/home', a donde quieras que vayan al entrar
}