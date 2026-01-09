// src/app/api/telegram/route.ts
import { createClient } from "@/infrastructure/supabase/server";
import { sendTelegramMessage } from "@/core/lib/telegram";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Verificamos si es un mensaje de texto
  if (body.message && body.message.text) {
    const text = body.message.text;
    const chatId = body.message.chat.id;

    // COMANDO: /stats
    if (text === "/stats") {
      await handleStatsCommand();
    }
    
    // COMANDO: /ping
    if (text === "/ping") {
        await sendTelegramMessage("🏓 <b>PONG!</b> El sistema está operativo.");
    }
  }

  return NextResponse.json({ ok: true });
}

// Lógica para el comando /stats
async function handleStatsCommand() {
  const supabase = await createClient();

  // Contar Alumnos
  const { count: students } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  // Contar Proyectos
  const { count: projects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  // Responder
  const report = `📊 <b>REPORTE DE ESTADO</b>\n\n` +
                 `👨‍🎓 <b>Alumnos:</b> ${students || 0}\n` +
                 `🚀 <b>Proyectos:</b> ${projects || 0}\n\n` +
                 `🟢 <i>Base de datos operativa.</i>`;

  await sendTelegramMessage(report);
}