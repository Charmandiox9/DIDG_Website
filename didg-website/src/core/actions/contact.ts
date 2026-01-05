"use server";

export async function sendMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    throw new Error("Faltan campos");
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    throw new Error("Faltan tokens de Telegram");
  }

  // --- ESTILO CYBERPUNK / TERMINAL ---
  // Usamos <b> para títulos
  // Usamos <code> para que parezca código de consola
  // Usamos <pre> para el bloque del mensaje
  const text = `
🚨 <b>INCOMING TRANSMISSION</b> 🚨
━━━━━━━━━━━━━━━━
<b>👤 USER_ID:</b> <code>${name}</code>
<b>📧 CONTACT:</b> <code>${email}</code>
<b>📅 TIME:</b> <code>${new Date().toLocaleString('es-CL')}</code>

<b>📂 PAYLOAD:</b>
<pre>${message}</pre>
━━━━━━━━━━━━━━━━
<i>> End of transmission.</i>
`;

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML", // <--- Importante para que lea el estilo
        
        // --- BOTÓN MÁGICO ---
        // Esto añade un botón debajo del mensaje para responder en 1 click
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📧 Responder Vía Email",
                url: `mailto:${email}?subject=RE: Contacto Web Didg&body=Hola ${name}, recibí tu mensaje...`
              }
            ]
          ]
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Telegram Error:", errorData);
      throw new Error("Error al enviar a Telegram");
    }

    return { success: true };

  } catch (error) {
    console.error(error);
    throw new Error("No se pudo enviar el mensaje.");
  }
}