"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
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
  
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    subject_id: formData.get("subject_id"),
    video_url: formData.get("video_url"),
  };

  const parsed = AyudantiaSchema.safeParse(rawData);
  if (!parsed.success) throw new Error("Datos inválidos");

  const file = formData.get("file") as File;
  let materialUrl = null;

  if (file && file.size > 0) {
    const filePath = `${parsed.data.subject_id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("course-materials")
      .upload(filePath, file);
    if (uploadError) throw new Error("Error subiendo archivo");
    materialUrl = filePath;
  }

  // @ts-ignore
  const { error } = await supabase.from("ayudantias").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    subject_id: parsed.data.subject_id,
    video_url: parsed.data.video_url || null,
    material_url: materialUrl,
  });

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/courses/${parsed.data.subject_id}`);
}

export async function updateAyudantia(id: string, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    subject_id: formData.get("subject_id"),
    video_url: formData.get("video_url"),
  };

  const parsed = AyudantiaSchema.safeParse(rawData);
  if (!parsed.success) throw new Error("Datos inválidos");

  // 1. Verificar si hay archivo nuevo para reemplazar el viejo
  const file = formData.get("file") as File;
  let newMaterialPath = undefined; // undefined significa "no tocar la columna"

  if (file && file.size > 0) {
    // A. Obtener info anterior para borrar el archivo viejo
    const { data } = await supabase.from("ayudantias").select("material_url").eq("id", id).single();
    const oldData = data as { material_url: string | null } | null;
    
    // B. Subir nuevo archivo
    const filePath = `${parsed.data.subject_id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from("course-materials").upload(filePath, file);
    if (uploadError) throw new Error("Error al subir nuevo archivo");
    
    newMaterialPath = filePath;

    // C. Borrar archivo viejo si existía
    if (oldData?.material_url) {
      await supabase.storage.from("course-materials").remove([oldData.material_url]);
    }
  }

  // 2. Preparar objeto de actualización
  const updates: any = {
    title: parsed.data.title,
    description: parsed.data.description,
    date: parsed.data.date,
    video_url: parsed.data.video_url || null,
    updated_at: new Date().toISOString(),
  };

  // Solo actualizamos material_url si hubo un archivo nuevo
  if (newMaterialPath) {
    updates.material_url = newMaterialPath;
  }

  // @ts-ignore
  const { error } = await supabase.from("ayudantias").update(updates).eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/dashboard/courses/${parsed.data.subject_id}`);
}

// Acción para borrar (útil para probar)
export async function deleteAyudantia(id: string, subjectId: string) {
  const supabase = await createClient();

  // 1. Obtener el archivo antes de borrar el registro
  const { data: ayudantia } = await supabase
    .from("ayudantias")
    .select("material_url")
    .eq("id", id)
    .single();

  // 2. Borrar de la base de datos
  const { error } = await supabase.from("ayudantias").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // 3. Si tenía archivo, borrarlo del bucket (Limpieza)
  if (ayudantia && (ayudantia as any).material_url) {
    await supabase.storage.from("course-materials").remove([(ayudantia as any).material_url]);
  }

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