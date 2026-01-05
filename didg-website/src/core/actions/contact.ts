"use server";

export async function sendMessage(data: any) {
  // 1. EXTRAER DATOS (Compatible con FormData y Objeto Plano)
  const name = typeof data.get === 'function' ? data.get('name') : data.name;
  const email = typeof data.get === 'function' ? data.get('email') : data.email;
  const message = typeof data.get === 'function' ? data.get('message') : data.message;

  console.log("Datos extraídos:", { name, email, message });

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
  const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, "");

  // 2. LIMPIEZA Y SEGURIDAD
  const cleanName = (name || "Anónimo").toString().replace(/<|>/g, "");
  const cleanEmail = (email || "Sin email").toString().trim();
  const cleanMessage = (message || "Sin mensaje").toString().replace(/<|>/g, "");

  const text = `<b>Nuevo mensaje de contacto</b>\n\n` +
               `👤 <b>Nombre:</b> ${cleanName}\n` +
               `📧 <b>Email:</b> ${cleanEmail}\n` +
               `💬 <b>Mensaje:</b>\n${cleanMessage}`;

  // 3. URLs BLINDADAS (Quitamos el WWW para máxima compatibilidad con Telegram)
  const cleanEmailForUrl = (email || "").toString().trim().replace(/\s/g, "");
  
  // Forzamos el dominio raíz sin WWW
  const cleanSiteUrl = "https://danielduran.engineer";

  const replyEmailUrl = `mailto:${cleanEmailForUrl}`;
  const dashboardUrl = `${cleanSiteUrl}/dashboard`;

  console.log("URL de Respuesta final:", replyEmailUrl);
  console.log("URL de Dashboard final:", dashboardUrl);

  // 4. PREPARAR CUERPO DEL MENSAJE (Evitar localhost en botones para Telegram)
  const isLocal = SITE_URL.includes('localhost');

  const telegramBody: any = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: "HTML",
  };

  // Solo agregamos botones si NO estamos en local
  if (!isLocal) {
    telegramBody.reply_markup = {
      inline_keyboard: [
        [
          { text: "📧 Responder", url: replyEmailUrl },
          { text: "🌐 Ver Dashboard", url: dashboardUrl }
        ]
      ]
    };
  }

  // 5. ENVÍO
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(telegramBody), // Usamos el body construido arriba
    });

    const result = await response.json();
    if (!result.ok) throw new Error(result.description);

    return { success: true };
  } catch (error) {
    console.error("Telegram Error:", error);
    throw new Error("No se pudo enviar el mensaje.");
  }
}