import { NextResponse } from "next/server";

export async function GET() {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const DOMAIN = "https://danielduran.engineer"; // Tu dominio real
  const WEBHOOK_URL = `${DOMAIN}/api/telegram`;

  if (!TOKEN) {
    return NextResponse.json({ error: "No hay token configurado en .env" }, { status: 500 });
  }

  // Construimos la URL internamente, asegurando que el prefijo 'bot' esté bien
  const telegramUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;

  try {
    const response = await fetch(telegramUrl);
    const data = await response.json();
    
    return NextResponse.json({
      status: "Intentando configurar webhook...",
      target_url: WEBHOOK_URL,
      telegram_response: data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}