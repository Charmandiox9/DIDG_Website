"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

// Helper para subir imágenes (Evita repetir código)
async function uploadImage(file: File, supabase: SupabaseClient) {
  if (!file || file.size === 0) return null;

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Error subiendo imagen:", uploadError);
    throw new Error("Fallo al subir la imagen");
  }

  const { data: { publicUrl } } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function createProject(formData: FormData) {
  const supabase = (await createClient()) as unknown as SupabaseClient<Database>;

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category"),
    repo_url: formData.get("repo_url") as string,
    demo_url: formData.get("demo_url") as string,
    tech_stack: formData.get("tech_stack"),
    project_date: formData.get("project_date") as string,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
  };

  // 1. Manejo de Imagen (Usando el helper)
  const imageFile = formData.get("image") as File;
  const imageUrl = await uploadImage(imageFile, supabase);

  // 2. Procesar datos
  const slug = rawData.title?.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") || "proyecto-" + Date.now();
  const techArray = rawData.tech_stack?.toString().split(",").map(t => t.trim()) || [];

  // 3. Insertar
  const { error: dbError } = await supabase.from("projects").insert({
    title: rawData.title,
    slug: slug,
    description: rawData.description,
    category: rawData.category as Database["public"]["Enums"]["project_category"],
    tech_stack: techArray,
    repo_url: rawData.repo_url,
    demo_url: rawData.demo_url,
    image_urls: imageUrl ? [imageUrl] : [], // Array de strings
    project_date: rawData.project_date,
    is_published: rawData.is_published,
    is_featured: rawData.is_featured,
  });

  if (dbError) {
    console.error("Error DB:", dbError);
    throw new Error("Error al guardar: " + dbError.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/projects");
  revalidatePath("/");
  redirect("/dashboard/projects");
}

// --- ACTUALIZAR PROYECTO ---
export async function updateProject(id: string, formData: FormData) {
  const supabase = (await createClient()) as unknown as SupabaseClient<Database>;
  
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category"),
    repo_url: formData.get("repo_url") as string,
    demo_url: formData.get("demo_url") as string,
    tech_stack: formData.get("tech_stack"),
    project_date: formData.get("project_date") as string,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
  };

  // 1. Manejo de Imagen (Lógica que faltaba)
  const imageFile = formData.get("image") as File;
  const newImageUrl = await uploadImage(imageFile, supabase);

  const techArray = rawData.tech_stack?.toString().split(",").map(t => t.trim()) || [];

  // 2. Construir objeto de actualización
  const updateData: any = {
    title: rawData.title,
    description: rawData.description,
    category: rawData.category as Database["public"]["Enums"]["project_category"],
    tech_stack: techArray,
    repo_url: rawData.repo_url,
    demo_url: rawData.demo_url,
    project_date: rawData.project_date,
    is_published: rawData.is_published,
    is_featured: rawData.is_featured,
  };

  // 3. Solo actualizamos la imagen si el usuario subió una nueva
  if (newImageUrl) {
    updateData.image_urls = [newImageUrl];
    // NOTA: Aquí podrías agregar lógica para borrar la imagen antigua de Storage si quieres ahorrar espacio
  }

  const { error } = await supabase.from("projects").update(updateData).eq("id", id);

  if (error) {
    console.error("Error al actualizar:", error);
    throw new Error("Error al actualizar proyecto");
  }

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/"); // Revalidar home por si es destacado
  redirect("/dashboard/projects");
}

// --- BORRAR PROYECTO ---
export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  
  if (error) throw new Error("Error al eliminar proyecto");
  
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}