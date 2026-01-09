"use server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // Tu ID personal (fallback)
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ACEPTA targetChatId COMO SEGUNDO ARGUMENTO OPCIONAL
export async function sendTelegramMessage(text: string, targetChatId?: number | string) {
  if (!BOT_TOKEN) return;

  // Si no pasamos ID, usa el tuyo por defecto.
  const finalChatId = targetChatId || DEFAULT_CHAT_ID;

  if (!finalChatId) {
      console.error("❌ Telegram Error: No chat ID provided");
      return;
  }

  try {
    const res = await fetch(`${BASE_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: finalChatId,
        text: text,
        parse_mode: "HTML",
      }),
    });
    
    if (!res.ok) {
        const errText = await res.text();
        console.error("❌ Telegram API Error:", errText);
    } else {
        console.log(`✅ Mensaje enviado a ${finalChatId}`);
    }

  } catch (error) {
    console.error("❌ Telegram Network Error:", error);
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