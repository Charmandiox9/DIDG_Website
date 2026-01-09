import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${TOKEN}/getWebhookInfo`;

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}