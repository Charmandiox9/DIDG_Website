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

export async function changePassword(currentPassword: string, newPassword: string) {
  const supabase = await createClient();

  // 1. Obtener el usuario actual para saber su email
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { error: "No hay sesión activa." };
  }

  // 2. VERIFICACIÓN: Intentamos iniciar sesión con la contraseña actual
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword
  });

  if (verifyError) {
    // Si falla, es que escribió mal su clave actual
    return { error: "La contraseña actual no es correcta." };
  }

  // 3. ACTUALIZACIÓN: Si llegamos aquí, la clave actual era buena. Procedemos.
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    return { error: updateError.message };
  }

  // Revalidar para asegurar que todo esté fresco
  revalidatePath("/", "layout");
  
  return { success: true };
}