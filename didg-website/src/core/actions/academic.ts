"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SemesterSchema = z.object({
  name: z.string().min(4, "Ej: 2025-1"),
});

const SubjectSchema = z.object({
  name: z.string().min(3),
  code: z.string().min(3),
  semester_id: z.string().uuid(),
});

// --- 1. CREAR SEMESTRE ---
export async function createSemester(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;

  // Validación básica
  const parsed = SemesterSchema.safeParse({ name });
  if (!parsed.success) throw new Error("Nombre de semestre inválido");

  // Desactivar semestre activo anterior (opcional, regla de negocio)
  // await supabase.from('semesters').update({ is_active: false }).neq('id', '...');

  // @ts-ignore - Desactivamos la validación estricta solo para esta inserción
  const { error } = await supabase.from("semesters").insert({
    name: parsed.data.name,
    is_active: true, // Por defecto activo
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/courses");
}

// --- 2. CREAR ASIGNATURA ---
export async function createSubject(formData: FormData) {
  const supabase = await createClient();
  
  const rawData = {
    name: formData.get("name"),
    code: formData.get("code"),
    semester_id: formData.get("semester_id"),
  };

  const parsed = SubjectSchema.safeParse(rawData);
  if (!parsed.success) throw new Error("Datos de asignatura inválidos");

  // @ts-ignore
  const { error } = await supabase.from("subjects").insert({
    name: parsed.data.name,
    code: parsed.data.code,
    semester_id: parsed.data.semester_id,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/courses");
}

// --- 3. TOGGLE ESTADO SEMESTRE ---

export async function toggleSemesterStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();
    // @ts-ignore
    await supabase.from("semesters").update({ is_active: !currentStatus }).eq("id", id);
    revalidatePath("/dashboard/courses");
}

// --- 4. ELIMINAR ASIGNATURA ---
export async function deleteSubject(subjectId: string) {
  const supabase = await createClient();
  
  // Al borrar la asignatura, Supabase borrará en cascada 
  // las ayudantías y matrículas asociadas (si configuramos ON DELETE CASCADE)
  const { error } = await supabase.from("subjects").delete().eq("id", subjectId);

  if (error) throw new Error("Error al eliminar asignatura: " + error.message);
  
  revalidatePath("/dashboard/courses");
}