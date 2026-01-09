// src/app/api/setup-webhook/route.ts
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  // 1. SIN WWW (Para que el DNS funcione)
  const DOMAIN = "https://danielduran.engineer"; 
  
  // 2. CON SLASH AL FINAL (Para evitar el error 307 de Vercel)
  const WEBHOOK_URL = `${DOMAIN}/api/telegram/`;

  if (!TOKEN) {
    return NextResponse.json({ error: "Falta token" }, { status: 500 });
  }

  // La URL mágica
  const telegramUrl = `https://api.telegram.org/bot${TOKEN}/setWebhook?url=${WEBHOOK_URL}`;

  try {
    const response = await fetch(telegramUrl);
    const data = await response.json();
    
    return NextResponse.json({
      config_used: {
        domain: DOMAIN,
        webhook_url: WEBHOOK_URL
      },
      telegram_response: data
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}