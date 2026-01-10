"use server";

import { createClient } from "@/infrastructure/supabase/client"; // Cliente estándar (RLS permite insert)
import { sendTelegramMessage } from "@/core/lib/telegram";

interface FeedbackInput {
  type: 'request' | 'report';
  message: string;
  resourceTitle?: string; // Opcional, solo para reportes
  subjectName?: string; // Opcional, nombre de la materia
}

export async function submitFeedback({ type, message, resourceTitle, subjectName }: FeedbackInput) {
  const supabase = createClient();

  // 1. Guardar en Base de Datos
  // @ts-ignore: Temporary fix
  const { error } = await supabase.from("feedback").insert({
    type,
    message,
    resource_title: resourceTitle,
    // Si tienes una columna subject_name o similar, agrégala aquí también si quieres guardarla
  });

  if (error) {
    console.error("Error guardando feedback:", error);
    return { ok: false, error: "No se pudo enviar la solicitud." };
  }

  // 2. Construir Mensaje Estilizado para Telegram
  const isReport = type === 'report';
  const icon = isReport ? '🚨' : '💡';
  const title = isReport ? 'REPORTE DE INCIDENCIA' : 'SOLICITUD DE CONTENIDO';
  const colorStrip = isReport ? '🔴' : '🔵'; // Decoración visual
  const hashtag = isReport ? '#BugReport' : '#FeatureRequest';
  const date = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });

  let telegramText = `<b>${icon} ${title}</b>\n`;
  telegramText += `──────────────────\n`; // Separador

  // Sección de Contexto (Solo si hay datos)
  if (subjectName || resourceTitle) {
    telegramText += `\n<b>📂 Contexto:</b>\n`;
    if (subjectName)  telegramText += `├ 📚 Asignatura: <code>${subjectName}</code>\n`;
    if (resourceTitle) telegramText += `└ 📄 Recurso: <code>${resourceTitle}</code>\n`;
  }

  // Sección del Mensaje (Usamos blockquote implícito con cursiva o pre)
  telegramText += `\n<b>💬 Mensaje del Usuario:</b>\n`;
  telegramText += `<i>"${message}"</i>\n\n`;
  
  // Footer con Metadata
  telegramText += `──────────────────\n`;
  telegramText += `${colorStrip} <b>Fecha:</b> ${date}\n`;
  telegramText += `#DIDG_System ${hashtag}`;

  // Enviamos mensaje asíncrono
  sendTelegramMessage(telegramText).catch(e => console.error("Telegram Error:", e));

  return { ok: true };
}