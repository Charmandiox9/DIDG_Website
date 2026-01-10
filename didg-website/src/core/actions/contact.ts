"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { sendTelegramMessage } from "@/core/lib/telegram"; // <--- Importamos la utilidad

export async function sendMessage(data: any) {
  // 1. EXTRAER DATOS
  const name = typeof data.get === 'function' ? data.get('name') : data.name;
  const email = typeof data.get === 'function' ? data.get('email') : data.email;
  const subject = typeof data.get === 'function' ? data.get('subject') : data.subject;
  const userMessage = typeof data.get === 'function' ? data.get('message') : data.message;

  // 2. GUARDAR EN SUPABASE
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("messages").insert({
      name, email, subject, message: userMessage
    } as any);
    if (error) console.error("Error Supabase:", error);
  } catch (err) {
    console.error("Error Crítico DB:", err);
  }

  // 3. PREPARAR DATOS VISUALES
  const date = new Date().toLocaleString("es-CL", { timeZone: "America/Santiago" });
  
  const cleanName = (name || "Anónimo").toString().replace(/<|>/g, "");
  const cleanEmail = (email || "Sin email").toString().trim();
  const cleanSubject = (subject || "Sin asunto").toString().replace(/<|>/g, "");
  const cleanMessage = (userMessage || "").toString().replace(/<|>/g, "");

  // 4. CONSTRUIR HTML (ESTILO TARJETA)
  const telegramText = `📬 <b>NUEVO MENSAJE DE CONTACTO</b>\n` +
                       `──────────────────\n\n` +
                       `👤 <b>Remitente:</b>\n` +
                       `├ <b>Nombre:</b> ${cleanName}\n` +
                       `└ <b>Email:</b> <code>${cleanEmail}</code>\n\n` +
                       `📌 <b>Asunto:</b> ${cleanSubject}\n\n` +
                       `💬 <b>Mensaje:</b>\n` +
                       `<i>"${cleanMessage}"</i>\n\n` +
                       `──────────────────\n` +
                       `📅 ${date}`;

  // 5. ENVIAR USANDO LA UTILIDAD CENTRALIZADA
  // Pasamos el texto Y el array de botones
  await sendTelegramMessage(telegramText, [
    { label: "🌐 Ver en Dashboard", url: "https://danielduran.engineer/dashboard/messages" }
  ]);

  return { success: true };
}