"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function registerStudent(prevState: any, formData: FormData) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, 
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const rut = formData.get("rut") as string;
  const password = formData.get("rut") as string; 

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, 
    user_metadata: {
      full_name: fullName,
      rut: rut,
      role: 'student'
    }
  });

  if (error) {
    console.error("Error Auth:", error);
    // Retornamos el error como texto en lugar de lanzar una excepción
    if (error.code === 'email_exists' || error.message.includes('already been registered')) {
        return { success: false, message: "⚠️ Este correo ya está registrado." };
    }
    return { success: false, message: "Error: " + error.message };
  }

  revalidatePath("/dashboard/students");
  // Retornamos éxito
  return { success: true, message: "Estudiante registrado correctamente" };
}