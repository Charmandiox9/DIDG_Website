// src/app/api/telegram/route.ts
import { createAdminClient } from "@/infrastructure/supabase/admin"; // <--- USAR ADMIN
import { sendTelegramMessage } from "@/core/lib/telegram";
import { NextResponse } from "next/server";

// 1. Agregar método GET para verificar en el navegador
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "El webhook de Telegram está activo y escuchando peticiones POST." 
  });
}

// 2. Método POST (El que usa Telegram)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificamos si es un mensaje de texto
    if (body.message && body.message.text) {
      const text = body.message.text;
      // const chatId = body.message.chat.id; // Podríamos usarlo para responderle a ese usuario específico

      console.log("📩 Comando recibido:", text); // Log para ver en consola

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
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Lógica para el comando /stats
async function handleStatsCommand() {
  // USAMOS ADMIN CLIENT PARA SALTARNOS EL RLS (Ya que el bot no tiene cookies de sesión)
  const supabase = createAdminClient();

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