import { NextResponse } from "next/server";

export async function GET() {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  // CAMBIO CRÍTICO: Agregamos 'www.'
  const DOMAIN = "https://www.danielduran.engineer"; 
  
  const WEBHOOK_URL = `${DOMAIN}/api/telegram`;

  if (!TOKEN) {
    return NextResponse.json({ error: "No hay token configurado en .env" }, { status: 500 });
  }

  // La URL para decirle a Telegram dónde estamos
  const telegramUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;

  try {
    const response = await fetch(telegramUrl);
    const data = await response.json();
    
    return NextResponse.json({
      status: "Configurando webhook con WWW...",
      target_url: WEBHOOK_URL, // Debería decir https://www....
      telegram_response: data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}