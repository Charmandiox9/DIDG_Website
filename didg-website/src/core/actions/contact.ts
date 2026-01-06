"use server";

import { createClient } from "@/infrastructure/supabase/server";

export async function sendMessage(data: any) {
  // 1. EXTRAER DATOS (Incluyendo 'subject')
  const name = typeof data.get === 'function' ? data.get('name') : data.name;
  const email = typeof data.get === 'function' ? data.get('email') : data.email;
  const subject = typeof data.get === 'function' ? data.get('subject') : data.subject; // <--- NUEVO
  const message = typeof data.get === 'function' ? data.get('message') : data.message;

  try {
    const supabase = await createClient();
    
    const { error: dbError } = await supabase.from("messages").insert({
      name: name,
      email: email,
      subject: subject,
      message: message,
      // created_at e is_read (false) suelen ponerse por defecto en la DB, 
      // si no, agrégalos aquí.
    } as any);

    if (dbError) {
      console.error("Error guardando en Supabase:", dbError);
      // Opcional: throw new Error("Error DB"); 
      // Si quieres que falle todo si la DB falla, lanza el error. 
      // Si prefieres que se envíe a Telegram aunque la DB falle, solo haz console.error.
    }
  } catch (err) {
    console.error("Error crítico DB:", err);
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  
  // 2. GENERAR FECHA Y HORA
  const timestamp = new Date().toLocaleString("es-CL", {
    timeZone: "America/Santiago",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  // 3. LIMPIEZA
  const cleanName = (name || "Anónimo").toString().replace(/<|>/g, "");
  const cleanEmail = (email || "Sin email").toString().trim();
  const cleanSubject = (subject || "Sin asunto").toString().replace(/<|>/g, ""); // <--- LIMPIEZA ASUNTO
  const cleanMessage = (message || "Sin mensaje").toString().replace(/<|>/g, ""); 

  // 4. CONSTRUCCIÓN DEL MENSAJE (Agregamos la línea de Asunto)
  const text = `<b>Nuevo mensaje de contacto</b>\n\n` +
               `👤 <b>Nombre:</b> ${cleanName}\n` +
               `📧 <b>Email:</b> ${cleanEmail}\n` +
               `📌 <b>Asunto:</b> ${cleanSubject}\n` +   // <--- AQUI APARECE
               `🕒 <b>Fecha:</b> ${timestamp}\n\n` +
               `💬 <b>Mensaje:</b>\n<pre>${cleanMessage}</pre>`;

  const dashboardUrl = "https://danielduran.engineer";

  const telegramBody: any = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🌐 Ver en la Web", url: dashboardUrl }]
      ]
    }
  };

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telegramBody),
    });

    const result = await response.json();
    if (!result.ok) throw new Error(result.description);
    return { success: true };
  } catch (error) {
    console.error("Telegram Error:", error);
    throw new Error("No se pudo enviar el mensaje.");
  }
}