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
  // Envolvemos en try/catch porque supabase.auth puede lanzar errores críticos de red/rate-limit
  let authData;
  try {
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) {
      // Manejo específico del Rate Limit (429)
      if (response.error.status === 429) {
        return { error: "⚠️ Demasiados intentos. Por favor espera 60 segundos." };
      }
      return { error: "Credenciales incorrectas" };
    }
    
    authData = response.data;

  } catch (err: any) {
    // Captura errores no controlados del cliente Auth
    if (err?.status === 429 || err?.code === 'over_request_rate_limit') {
         return { error: "⚠️ Demasiados intentos. Por favor espera 60 segundos." };
    }
    return { error: "Error de conexión con el servicio de autenticación." };
  }

  if (!authData || !authData.user) {
    return { error: "Credenciales incorrectas" };
  }

  // 2. Obtener el Rol del Usuario
  const { data: profile } = await adminDb
    .from("profiles")
    .select("role")
    .eq("id", authData.user.id)
    .single();

  // 3. LÓGICA DE BIFURCACIÓN
  
  // CASO A: ES ESTUDIANTE -> Pase directo
  if (profile?.role === "student") {
    redirect("/dashboard"); 
  }

  // CASO B: ES ADMIN -> Exigir 2FA
  // Importante: Cerramos la sesión para obligar a verificar el código
  await supabase.auth.signOut();

  // --- LÓGICA 2FA ---

  // 4. Generar Código
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 5. Guardar código en DB (Admin Privileges)
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
                  `├ <b>Usuario:</b> <code>${email}</code>\n` +
                  `└ <b>Nivel:</b> ${roleIcon} ${profile?.role?.toUpperCase()}\n\n` +
                  `🔑 <b>TU CÓDIGO DE ACCESO:</b>\n` +
                  `👉 <code>${code}</code> 👈\n\n` +
                  `──────────────────\n` +
                  `⚠️ <i>Este código expira en breve. Si no fuiste tú, asegura tu cuenta inmediatamente.</i>\n` +
                  `📅 ${date}`;

  // Enviamos el mensaje sin await bloqueante si queremos velocidad, 
  // pero con await aseguramos que salió antes de cambiar la UI.
  try {
      await sendTelegramMessage(message);
  } catch (e) {
      console.error("Fallo al enviar Telegram:", e);
      // No bloqueamos el login si falla Telegram, pero mostramos el error en logs
  }

  // 7. Retornar estado para el Frontend
  return { step: "verify_2fa", email, password }; 
}

// ... completeLogin se mantiene igual, pero asegúrate de manejar el error 429 ahí también ...

export async function completeLogin(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const code = formData.get("code") as string;
  const supabase = await createClient();
  const adminDb = createAdminClient();

  // 1. Validar Código
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

  // 2. Borrar código
  await adminDb.from("verification_codes").delete().eq("id", record.id);

  // 3. Login Final (Aquí también puede saltar el 429 si fue muy rápido)
  try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        if (loginError.status === 429) {
            // Si falla aquí, es doloroso porque el código ya se quemó.
            // Opción: No borrar el código hasta el éxito, o pedir reintentar.
            return { error: "Demasiados intentos. Espera unos segundos e intenta de nuevo.", step: "verify_2fa", email, password };
        }
        return { error: "Error al iniciar sesión." };
      }
  } catch (err: any) {
      return { error: "Error de conexión.", step: "verify_2fa", email, password };
  }

  redirect("/dashboard");
}