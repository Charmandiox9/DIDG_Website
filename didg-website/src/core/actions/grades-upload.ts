"use server";

// 1. Importamos createClient directamente de la librería base, NO de tu infraestructura
import { createClient } from "@supabase/supabase-js"; 
import { revalidatePath } from "next/cache";
import * as XLSX from "xlsx";

export async function uploadGrades(formData: FormData) {
  // 2. Creamos el cliente ADMIN (Bypass RLS)
  // Este cliente tiene permisos de "Dios" para leer y escribir todo.
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // <--- CLAVE IMPORTANTE
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  // 1. Obtener datos del Formulario
  const subjectId = formData.get("subject_id") as string;
  const evaluationName = formData.get("evaluation_name") as string;
  const file = formData.get("file") as File;

  if (!file || !subjectId || !evaluationName) {
    throw new Error("Faltan datos requeridos.");
  }

  // 2. Leer el archivo
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 3. Parsear Excel
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet);

  let successCount = 0;
  let errors: string[] = [];

  for (const row of rows) {
    const rut = row["rut"] || row["RUT"] || row["Rut"];
    const score = row["nota"] || row["NOTA"] || row["Nota"] || row["score"];

    if (!rut || !score) continue;

    try {
      // A. Buscar ID del usuario (Usamos supabaseAdmin para evitar bloqueos de lectura)
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("rut", String(rut).trim())
        .single();

      if (!profile) {
        errors.push(`RUT no encontrado: ${rut}`);
        continue;
      }

      // B. Buscar o Crear Matrícula
      let { data: enrollment } = await supabaseAdmin
        .from("enrollments")
        .select("id")
        // @ts-ignore
        .eq("student_id", profile.id)
        .eq("subject_id", subjectId)
        .single();

      if (!enrollment) {
        // AQUÍ FALLABA ANTES: Ahora supabaseAdmin sí tiene permiso para crearla
        const { data: newEnrollment, error: enrollError } = await supabaseAdmin
          .from("enrollments")
          // @ts-ignore
          .insert({ student_id: profile.id, subject_id: subjectId })
          .select("id")
          .single();
        
        if (enrollError) throw enrollError;
        enrollment = newEnrollment;
      }

      // C. Insertar la Nota
      // @ts-ignore
      const { error: gradeError } = await supabaseAdmin.from("grades").insert({
        enrollment_id: (enrollment as any)!.id,
        name: evaluationName,
        score: parseFloat(score),
        weight: 1.0 
      });

      if (gradeError) throw gradeError;

      successCount++;

    } catch (err: any) {
      console.error(err);
      errors.push(`Error con RUT ${rut}: ${err.message}`);
    }
  }

  revalidatePath("/dashboard/grades");
  
  return { 
    success: true, 
    count: successCount, 
    errors: errors.length > 0 ? errors : null 
  };
}