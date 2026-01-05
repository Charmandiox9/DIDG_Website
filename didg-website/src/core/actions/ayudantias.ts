"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const AyudantiaSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  date: z.string(),
  subject_id: z.string().uuid(),
  video_url: z.string().url().optional().or(z.literal("")),
});

export async function createAyudantia(formData: FormData) {
  const supabase = await createClient();

  // 1. Validar Datos
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    subject_id: formData.get("subject_id"),
    video_url: formData.get("video_url"),
  };

  const parsed = AyudantiaSchema.safeParse(rawData);
  if (!parsed.success) {
    throw new Error("Datos inválidos: " + JSON.stringify(parsed.error.flatten()));
  }

  // 2. Manejar Archivo (Material)
  const file = formData.get("file") as File;
  let materialUrl = null;

  if (file && file.size > 0) {
    // Nombre único para evitar colisiones: subject_id/timestamp_filename
    const filePath = `${parsed.data.subject_id}/${Date.now()}_${file.name}`;
    
    const { error: uploadError } = await supabase.storage
      .from("course-materials") // Bucket PRIVADO
      .upload(filePath, file);

    if (uploadError) throw new Error("Error subiendo archivo: " + uploadError.message);

    // Guardamos el PATH (ruta interna), no la URL pública, porque es privado
    materialUrl = filePath;
  }

  // 3. Insertar en DB
  // @ts-ignore
  const { error: dbError } = await supabase.from("ayudantias").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    subject_id: parsed.data.subject_id,
    video_url: parsed.data.video_url || null,
    material_url: materialUrl, // Guardamos la ruta del archivo
  });

  if (dbError) throw new Error(dbError.message);

  revalidatePath(`/dashboard/courses/${parsed.data.subject_id}`);
}

// Acción para borrar (útil para probar)
export async function deleteAyudantia(id: string, subjectId: string) {
    const supabase = await createClient();
    await supabase.from("ayudantias").delete().eq("id", id);
    revalidatePath(`/dashboard/courses/${subjectId}`);
}

export async function getSignedUrl(filePath: string) {
  const supabase = await createClient();

  // Pedimos una URL firmada válida por 60 segundos
  const { data, error } = await supabase.storage
    .from("course-materials")
    .createSignedUrl(filePath, 60); // 60 segundos de vida

  if (error) {
    console.error("Error firmando URL:", error);
    throw new Error("No se pudo generar el enlace de descarga");
  }

  return data.signedUrl;
}