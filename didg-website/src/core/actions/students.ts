"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendTelegramMessage } from "@/core/lib/telegram";

// --- CLIENTE ADMIN (Service Role) ---
// Lo definimos aquí para reutilizarlo en todas las funciones
const getAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

// ==================================================================
// 1. REGISTRAR ESTUDIANTE (Ya lo tenías, con ligeras mejoras)
// ==================================================================
export async function registerStudent(prevState: any, formData: FormData) {
  const supabaseAdmin = getAdminClient();

  const email = formData.get("email") as string;
  const fullName = formData.get("full_name") as string;
  const rut = formData.get("rut") as string;
  const password = formData.get("rut") as string; // La clave es el RUT

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Confirmamos el email automáticamente
    user_metadata: {
      full_name: fullName,
      rut: rut,
      role: "student",
    },
  });

  if (error) {
    console.error("Error Auth:", error);
    if (
      error.code === "email_exists" ||
      error.message.includes("already been registered")
    ) {
      return {
        success: false,
        message: "⚠️ Este correo ya está registrado.",
      };
    }
    return { success: false, message: "Error: " + error.message };
  }

  if (!error) {
    // 🔥 DISPARAR NOTIFICACIÓN AL BOT
    const date = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

    const msg = `🎉 <b>NUEVA MATRÍCULA REGISTRADA</b>\n` +
                `──────────────────\n\n` +
                `👤 <b>Información del Estudiante:</b>\n` +
                `├ <b>Nombre:</b> ${fullName}\n` +
                `├ <b>RUT:</b> <code>${rut}</code>\n` + // 👈 Click para copiar
                `└ <b>Email:</b> <code>${email}</code>\n\n` + // 👈 Click para copiar
                `──────────────────\n` +
                `📅 <b>Fecha:</b> ${date}\n` +
                `#NewStudent #DIDG_System`;

    // No usamos await para no bloquear la UI del usuario
    sendTelegramMessage(msg).catch(e => console.error("Telegram Error:", e));

    return { success: true, message: "Estudiante registrado correctamente." };
  }

  revalidatePath("/dashboard/students");
  return { success: true, message: "Estudiante registrado correctamente" };
}

// ==================================================================
// 2. ACTUALIZAR ESTUDIANTE
// ==================================================================
export async function updateStudent(
  id: string,
  data: { 
    full_name: string; 
    rut: string; 
    email: string;      // Ahora es obligatorio recibirlo
    password?: string;  // Opcional: solo si queremos cambiarla
  }
) {
  const supabaseAdmin = getAdminClient();

  // 1. Preparamos los datos para actualizar en AUTH (Login)
  const authUpdates: any = {
    email: data.email,
    email_confirm: true, // Confirmamos automáticamente el nuevo correo
    user_metadata: {
      full_name: data.full_name,
      rut: data.rut,
    },
  };

  // Solo agregamos la contraseña si el admin escribió algo
  if (data.password && data.password.trim().length > 0) {
    authUpdates.password = data.password;
  }

  // 2. Ejecutamos la actualización en AUTH
  const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
    id,
    authUpdates
  );

  if (authError) {
    console.error("Error Auth Update:", authError);
    // Manejo de error de correo duplicado
    if (authError.message.includes("Email address already in use") || authError.code === "email_exists") {
       return { error: "⚠️ Este correo ya está siendo usado por otro usuario." };
    }
    return { error: "Error al actualizar credenciales: " + authError.message };
  }

  // 3. Actualizamos los datos visuales en la tabla 'profiles'
  // (Aunque Auth actualiza metadata, profile es nuestra tabla de consulta rápida)
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      full_name: data.full_name,
      rut: data.rut,
      // No actualizamos 'email' aquí manualmente porque Supabase suele 
      // sincronizarlo o es mejor confiar en Auth, pero si tu tabla profiles tiene columna email:
      // email: data.email 
    })
    .eq("id", id);

  if (profileError) {
    return { error: "Datos de Auth actualizados, pero falló perfil: " + profileError.message };
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

// ==================================================================
// 3. ELIMINAR ESTUDIANTE (Modo Dios)
// ==================================================================
export async function deleteStudent(id: string) {
  const supabaseAdmin = getAdminClient();

  // Esta función es PODEROSA:
  // Borra al usuario del sistema de Autenticación.
  // Gracias al "ON DELETE CASCADE" en tu base de datos (si está configurado),
  // se borrará automáticamente su perfil, sus notas y sus matrículas.
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}