"use server";

import { createClient } from "@/infrastructure/supabase/client"; // Cliente estándar (RLS permite insert)
import { sendTelegramMessage } from "@/core/lib/telegram";

interface FeedbackInput {
  type: 'request' | 'report';
  message: string;
  resourceTitle?: string; // Opcional, solo para reportes
}

export async function submitFeedback({ type, message, resourceTitle }: FeedbackInput) {
  const supabase = createClient();

  // 1. Guardar en Base de Datos
  // @ts-ignore: Temporary fix for missing table definition in types
  const { error } = await supabase.from("feedback").insert({
    type,
    message,
    resource_title: resourceTitle
  });

  if (error) {
    console.error("Error guardando feedback:", error);
    return { ok: false, error: "No se pudo enviar la solicitud." };
  }

  // 2. Notificar por Telegram (Fire and forget - no esperamos la respuesta para no bloquear)
  const icon = type === 'report' ? '🚨' : '💡';
  const title = type === 'report' ? 'REPORTE DE ERROR' : 'SOLICITUD DE TEMA';
  
  let telegramText = `${icon} <b>${title}</b>\n\n`;
  telegramText += `💬 <i>"${message}"</i>\n`;
  
  if (resourceTitle) {
    telegramText += `\n📄 <b>Recurso afectado:</b> ${resourceTitle}`;
  }

  // Enviamos mensaje asíncrono (sin await)
  sendTelegramMessage(telegramText).catch(e => console.error("Telegram Error:", e));

  return { ok: true };
}