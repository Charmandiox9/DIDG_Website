"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { createAdminClient } from "@/infrastructure/supabase/admin"; 
import { sendTelegramMessage } from "@/core/lib/telegram";
import { redirect } from "next/navigation";

// --- PASO 1: INICIAR LOGIN Y DECIDIR SI PIDE 2FA ---
export async function initiateLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();
  const adminDb = createAdminClient();

  // 1. Validar Credenciales (Email/Pass)
  // Intentamos iniciar sesión para verificar que la contraseña sea real
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !authData.user) {
    return { error: "Credenciales incorrectas" };
  }

  // 2. Obtener el Rol del Usuario
  // Usamos el ID del usuario autenticado para buscar su perfil
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  // 3. LÓGICA DE BIFURCACIÓN (BRANCHING)
  
  // CASO A: ES ESTUDIANTE -> Pase directo
  if (profile?.role === "student") {
    // La sesión ya está iniciada por el paso 1, así que solo redirigimos.
    redirect("/dashboard"); 
    // (El código se detiene aquí para estudiantes)
  }

  // CASO B: ES ADMIN (o cualquier otro rol) -> Exigir 2FA
  // Como es admin, cerramos la sesión que acabamos de abrir para forzar el paso 2
  await supabase.auth.signOut();

  // --- A PARTIR DE AQUÍ ES LA LÓGICA DE 2FA ---

  // 4. Generar Código
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 5. Guardar código en DB
  await adminDb.from("verification_codes").delete().eq("email", email);
  
  const { error: dbError } = await adminDb.from("verification_codes").insert({
    email,
    code,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });

  if (dbError) return { error: "Error de seguridad (DB)." };

  // 6. Enviar a Telegram
  const date = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const roleIcon = profile?.role === 'admin' ? '👑' : '👤';

  const message = `🛡️ <b>SOLICITUD DE ACCESO 2FA</b>\n` +
                  `──────────────────\n\n` +
                  `👤 <b>Credenciales:</b>\n` +
                  `├ <b>Usuario:</b> <code>${email}</code>\n` + // Click para copiar email
                  `└ <b>Nivel:</b> ${roleIcon} ${profile?.role?.toUpperCase()}\n\n` +
                  `🔑 <b>TU CÓDIGO DE ACCESO:</b>\n` +
                  `👉 <code>${code}</code> 👈\n\n` + // Click para copiar código
                  `──────────────────\n` +
                  `⚠️ <i>Este código expira en breve. Si no fuiste tú, asegura tu cuenta inmediatamente.</i>\n` +
                  `📅 ${date}`;

  await sendTelegramMessage(message);

  // 7. Decirle al Frontend que muestre el input de código
  return { step: "verify_2fa", email, password }; 
}


// --- PASO 2: VERIFICAR CÓDIGO (Solo para Admins) ---
export async function completeLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const code = formData.get("code") as string;
  const supabase = await createClient();
  const adminDb = createAdminClient();

  // 1. Buscar código
  const { data: record } = await adminDb
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .single();

  if (!record) {
    return { error: "Código inválido", step: "verify_2fa", email, password };
  }

  if (new Date(record.expires_at) < new Date()) {
    return { error: "El código ha expirado", step: "verify_2fa", email, password };
  }

  // 2. Borrar código usado
  await adminDb.from("verification_codes").delete().eq("id", record.id);

  // 3. Login Final
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
    return { error: "Error al iniciar sesión." };
  }

  redirect("/dashboard");
}