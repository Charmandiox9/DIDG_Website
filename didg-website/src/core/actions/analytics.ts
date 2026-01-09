"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { createAdminClient } from "@/infrastructure/supabase/admin";

// --- ACCIÓN 1: REGISTRAR DESCARGA (Llamar al hacer click en un archivo) ---
export async function trackDownload(resourceName: string, subjectName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Insertamos "fire and forget" (no esperamos ni validamos errores estrictos para no bloquear al usuario)
  // @ts-ignore: Temporary fix for missing table definition in types
  await supabase.from("analytics_events").insert({
    event_type: "download",
    resource_name: resourceName,
    subject_name: subjectName,
    user_id: user?.id || null,
  });
}

// --- ACCIÓN 2: OBTENER DATOS PARA GRÁFICOS (Solo Admin) ---
export async function getDownloadsBySubject() {
  const supabase = createAdminClient();

  // Obtenemos todos los eventos de descarga
  const { data, error } = await supabase
    .from("analytics_events")
    .select("subject_name")
    .eq("event_type", "download");

  if (error || !data) return [];

  // Procesamiento de datos en JS (Agrupar y Contar)
  // Transformamos: [{subject: 'A'}, {subject: 'A'}, {subject: 'B'}] 
  // A: [{name: 'A', value: 2}, {name: 'B', value: 1}]
  
  const countMap: Record<string, number> = {};

  data.forEach((item) => {
    const subject = item.subject_name || "Otros";
    countMap[subject] = (countMap[subject] || 0) + 1;
  });

  // Convertimos a array para Recharts y ordenamos por popularidad
  return Object.entries(countMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Orden descendente
}

// --- ACCIÓN 3: OBTENER ÚLTIMAS DESCARGAS (Feed de Actividad) ---
export async function getRecentDownloads() {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("analytics_events")
    .select("*")
    .eq("event_type", "download")
    .order("created_at", { ascending: false }) // Del más nuevo al más viejo
    .limit(3); // Solo los últimos 3

  return data || [];
}