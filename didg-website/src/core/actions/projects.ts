"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// 1. IMPORTANTE: Importar estos dos tipos
import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function createProject(formData: FormData) {
  // 2. SOLUCIÓN DEL ERROR:
  // Forzamos a TypeScript a tratar este cliente como uno que conoce tu Database.
  // El "as SupabaseClient<Database>" elimina el error de 'never'.
  const supabase = (await createClient()) as unknown as SupabaseClient<Database>;

  // 1. Extraer datos básicos
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    repo_url: formData.get("repo_url"),
    demo_url: formData.get("demo_url"),
    tech_stack: formData.get("tech_stack"),
    project_date: formData.get("project_date"),
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
  };

  // 2. Manejo de Imagen
  const imageFile = formData.get("image") as File;
  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("portfolio-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Error subiendo imagen:", uploadError);
      throw new Error("Fallo al subir la imagen");
    }

    const { data: { publicUrl } } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filePath);
      
    imageUrl = publicUrl;
  }

  // 3. Insertar en Base de Datos
  const slug = rawData.title?.toString().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") || "proyecto-" + Date.now();
  const techArray = rawData.tech_stack?.toString().split(",").map(t => t.trim()) || [];

  // 4. INSERTAR
  // Ahora TypeScript sabe que "category" debe ser del tipo Enum específico, así que lo casteamos
  const { error: dbError } = await supabase.from("projects").insert({
    title: rawData.title as string,
    slug: slug,
    description: rawData.description as string,
    // Casteamos a 'any' o al tipo del Enum para evitar conflictos de string vs Enum literal
    category: rawData.category as Database["public"]["Enums"]["project_category"], 
    tech_stack: techArray,
    repo_url: rawData.repo_url as string,
    demo_url: rawData.demo_url as string,
    image_urls: imageUrl ? [imageUrl] : [],
    
    // Estos campos ahora son reconocidos gracias al cast del inicio
    project_date: rawData.project_date as string,
    is_published: rawData.is_published,
    is_featured: rawData.is_featured,
  });

  if (dbError) {
    console.error("Error DB:", dbError);
    throw new Error("Error al guardar en base de datos: " + dbError.message);
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
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    repo_url: formData.get("repo_url"),
    demo_url: formData.get("demo_url"),
    tech_stack: formData.get("tech_stack"),
    project_date: formData.get("project_date"),
    // Para checkboxes en update, si no viene es false
    is_published: formData.get("is_published") === "on", 
    is_featured: formData.get("is_featured") === "on",
  };

  const techArray = rawData.tech_stack?.toString().split(",").map(t => t.trim()) || [];

  const { error } = await supabase.from("projects").update({
    title: rawData.title as string,
    description: rawData.description as string,
    category: rawData.category as any,
    tech_stack: techArray,
    repo_url: rawData.repo_url as string,
    demo_url: rawData.demo_url as string,
    project_date: rawData.project_date as string,
    is_published: rawData.is_published,
    is_featured: rawData.is_featured,
  }).eq("id", id);

  if (error) throw new Error("Error al actualizar");

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  redirect("/dashboard/projects");
}

// --- BORRAR PROYECTO ---
export async function deleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error("Error al eliminar proyecto");
  
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
}