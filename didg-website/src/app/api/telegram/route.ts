import { createAdminClient } from "@/infrastructure/supabase/admin"; 
import { sendTelegramMessage } from "@/core/lib/telegram";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "El webhook de Telegram está activo." 
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verificamos si es un mensaje de texto
    if (body.message && body.message.text) {
      const text = body.message.text;
      
      // 1. DESCOMENTAMOS ESTO: Es vital para saber a quién responder
      const chatId = body.message.chat.id; 

      console.log(`📩 Comando: ${text} | ChatID: ${chatId}`);

      // COMANDO: /stats
      if (text === "/stats") {
        // Pasamos el chatId
        await handleStatsCommand(chatId);
      }
      
      // COMANDO: /ping
      if (text === "/ping") {
         // Pasamos el chatId
         await sendTelegramMessage("🏓 <b>PONG!</b> El sistema está operativo.", chatId);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en webhook:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Lógica para el comando /stats
// Aceptamos chatId como argumento
async function handleStatsCommand(chatId: number | string) {
  const supabase = createAdminClient();

  const { count: students } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  const { count: projects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const report = `📊 <b>REPORTE DE ESTADO</b>\n\n` +
                 `👨‍🎓 <b>Alumnos:</b> ${students || 0}\n` +
                 `🚀 <b>Proyectos:</b> ${projects || 0}\n\n` +
                 `🟢 <i>Base de datos operativa.</i>`;

  // Respondemos al ID específico
  await sendTelegramMessage(report, chatId);
}