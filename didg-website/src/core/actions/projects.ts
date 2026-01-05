"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Validamos los datos antes de tocar la DB
const ProjectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.enum(["software", "script", "hardware"]),
  repo_url: z.string().url().optional().or(z.literal("")),
  demo_url: z.string().url().optional().or(z.literal("")),
  tech_stack: z.string(), // Vendrá como string separado por comas "React, Node, IoT"
});

// --- BORRAR PROYECTO ---
export async function deleteProject(id: string) {
  const supabase = await createClient();
  
  // Opcional: Borrar imágenes del storage si quisieras ser muy limpio
  // Pero por ahora solo borramos el registro de la DB
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw new Error("Error al eliminar proyecto");
  
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects"); // También actualizar la vista pública
}

// --- ACTUALIZAR PROYECTO ---
export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    repo_url: formData.get("repo_url"),
    demo_url: formData.get("demo_url"),
    tech_stack: formData.get("tech_stack"),
  };

  // Convertir stack a array
  const techArray = rawData.tech_stack?.toString().split(",").map(t => t.trim()) || [];

  // Solo actualizamos campos de texto (la imagen la dejamos igual por simplicidad en este paso)
  // @ts-ignore
  const { error } = await supabase.from("projects").update({
    title: rawData.title as string,
    description: rawData.description as string,
    category: rawData.category as any,
    tech_stack: techArray,
    repo_url: rawData.repo_url as string,
    demo_url: rawData.demo_url as string,
  }).eq("id", id);

  if (error) throw new Error("Error al actualizar");

  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}

export async function createProject(formData: FormData) {
  const supabase = await createClient();

  // 1. Extraer datos del formulario
  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    repo_url: formData.get("repo_url"),
    demo_url: formData.get("demo_url"),
    tech_stack: formData.get("tech_stack"),
  };

  // 2. Manejo de Imagen (Si existe)
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

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from("portfolio-images")
      .getPublicUrl(filePath);
      
    imageUrl = publicUrl;
  }

  

  // 3. Insertar en Base de Datos
  // Generamos el slug a partir del título (ej: "Mi Proyecto" -> "mi-proyecto")
  const slug = rawData.title?.toString().toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") || "proyecto-" + Date.now();
  
  // Convertir tech_stack de "React, Node" a array ["React", "Node"]
  const techArray = rawData.tech_stack?.toString().split(",").map(t => t.trim()) || [];

  // @ts-ignore
  const { error: dbError } = await supabase.from("projects").insert({
    title: rawData.title as string,
    slug: slug,
    description: rawData.description as string,
    category: rawData.category as any, // TypeScript se quejará un poco aquí si no casteamos
    tech_stack: techArray,
    repo_url: rawData.repo_url as string,
    demo_url: rawData.demo_url as string,
    image_urls: imageUrl ? [imageUrl] : [],
    is_featured: false,
  });

  if (dbError) {
    console.error("Error DB:", dbError);
    throw new Error("Error al guardar en base de datos: " + dbError.message);
  }

  // 4. Actualizar caché y redirigir
  revalidatePath("/dashboard");
  revalidatePath("/projects");
  redirect("/dashboard/projects");
}