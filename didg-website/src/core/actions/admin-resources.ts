"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";

// --- CREAR O ACTUALIZAR ---
export async function saveResource(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string | null;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const external_url = formData.get("external_url") as string;
  const tagsString = formData.get("tags") as string; // "react, hooks, frontend"
  
  // Convertir tags de string a array
  const tags = tagsString.split(",").map(t => t.trim()).filter(t => t.length > 0);

  // Manejo de Archivo (Si se subió uno nuevo)
  const file = formData.get("file") as File | null;
  let file_url = formData.get("existing_file_url") as string | null;

  if (file && file.size > 0) {
    const fileName = `${Date.now()}_${file.name.replaceAll(" ", "_")}`;
    const { error: uploadError } = await supabase.storage
      .from("materials")
      .upload(fileName, file);

    if (uploadError) throw new Error("Error subiendo archivo");
    file_url = fileName;
  }

  const payload = {
    title,
    description,
    category,
    tags,
    external_url: external_url || null,
    file_url: file_url || null,
  };

  let error;
  if (id) {
    // UPDATE
    // @ts-ignore: Temporary fix for missing table definition in types
    const { error: updateError } = await supabase.from("extra_resources").update(payload).eq("id", id);
    error = updateError;
  } else {
    // CREATE
    // @ts-ignore: Temporary fix for missing table definition in types
    const { error: insertError } = await supabase.from("extra_resources").insert(payload);
    error = insertError;
  }

  if (error) {
    console.error(error);
    return { ok: false, message: "Error al guardar en base de datos" };
  }

  revalidatePath("/resources"); // Actualizar la vista pública
  revalidatePath("/dashboard/resources"); // Actualizar el admin
  return { ok: true };
}

// --- ELIMINAR ---
export async function deleteResource(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("extra_resources").delete().eq("id", id);

  if (error) return { ok: false };
  
  revalidatePath("/resources");
  revalidatePath("/dashboard/resources");
  return { ok: true };
}