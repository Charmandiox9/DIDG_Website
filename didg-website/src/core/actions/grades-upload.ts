"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx"; // Importamos la librería

export async function uploadGrades(formData: FormData) {
  const supabase = await createClient();

  // 1. Obtener datos del Formulario
  const subjectId = formData.get("subject_id") as string;
  const evaluationName = formData.get("evaluation_name") as string;
  const file = formData.get("file") as File;

  if (!file || !subjectId || !evaluationName) {
    throw new Error("Faltan datos requeridos.");
  }

  // 2. Leer el archivo (Buffer)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Parsear Excel/CSV
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convertimos a JSON: [{ rut: "111-1", nota: 7.0 }, ...]
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

  // 4. Procesar fila por fila
  let successCount = 0;
  let errors: string[] = [];

  for (const row of rows) {
    // Normalizamos las claves (por si escriben "RUT", "Rut", "rut")
    const rut = row["rut"] || row["RUT"] || row["Rut"];
    const score = row["nota"] || row["NOTA"] || row["Nota"] || row["score"];

    if (!rut || !score) continue; // Saltar filas vacías

    try {
      // A. Buscar ID del usuario por su RUT
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("rut", String(rut).trim())
        .single();

      if (!profile) {
        errors.push(`RUT no encontrado: ${rut}`);
        continue;
      }

      // B. Buscar o Crear Matrícula (Enrollment)
      // Primero intentamos buscarla
      let { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", profile.id)
        .eq("subject_id", subjectId)
        .single();

      // Si no existe matrícula, LA CREAMOS automáticamente
      if (!enrollment) {
        const { data: newEnrollment, error: enrollError } = await supabase
          .from("enrollments")
          .insert({ student_id: profile.id, subject_id: subjectId })
          .select("id")
          .single();
        
        if (enrollError) throw enrollError;
        enrollment = newEnrollment;
      }

      // C. Insertar la Nota
      const { error: gradeError } = await supabase.from("grades").insert({
        enrollment_id: enrollment!.id,
        name: evaluationName,
        score: parseFloat(score), // Asegurar que sea número
        weight: 1.0 // Por defecto
      });

      if (gradeError) throw gradeError;

      successCount++;

    } catch (err: any) {
      console.error(err);
      errors.push(`Error con RUT ${rut}: ${err.message}`);
    }
  }

  revalidatePath("/dashboard/grades");
  
  // Retornamos el reporte
  return { 
    success: true, 
    count: successCount, 
    errors: errors.length > 0 ? errors : null 
  };
}