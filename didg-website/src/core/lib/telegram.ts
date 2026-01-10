"use server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Tu ID personal (fallback)
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramButton {
  label: string;
  url: string;
}

// ACEPTA targetChatId COMO SEGUNDO ARGUMENTO OPCIONAL
export async function sendTelegramMessage(text: string, buttons: TelegramButton[] = []) {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn("⚠️ Telegram no configurado (Faltan variables de entorno).");
    return;
  }

  // Construimos el cuerpo del mensaje
  const body: any = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: "HTML",
    disable_web_page_preview: true, // Para que no llene el chat con previsualizaciones de enlaces
  };

  // Si hay botones, construimos el teclado inline
  if (buttons.length > 0) {
    body.reply_markup = {
      inline_keyboard: [
        // Mapeamos los botones. Telegram pide arrays de arrays (filas de columnas)
        buttons.map((btn) => ({
          text: btn.label,
          url: btn.url,
        })),
      ],
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!result.ok) {
      console.error("❌ Error API Telegram:", result.description);
    }
  } catch (error) {
    console.error("❌ Error Red Telegram:", error);
  }
}

// ... getBotStatus igual que antes
export async function getBotStatus() {
  if (!BOT_TOKEN) return { ok: false };
  try {
    const res = await fetch(`${BASE_URL}/getMe`, { cache: 'no-store' });
    const data = await res.json();
    return { 
      ok: data.ok, 
      username: data.result?.username,
      name: data.result?.first_name
    };
  } catch (error) {
    return { ok: false };
  }
}