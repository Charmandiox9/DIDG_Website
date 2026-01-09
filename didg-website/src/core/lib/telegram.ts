"use server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

// 1. Enviar Mensaje Genérico
export async function sendTelegramMessage(text: string) {
  if (!BOT_TOKEN || !CHAT_ID) return;

  try {
    await fetch(`${BASE_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.error("Telegram Send Error:", error);
  }
}

// 2. Verificar Estado del Bot (Para tu Dashboard)
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