"use server";

import { createClient } from "@/infrastructure/supabase/server";
import { revalidatePath } from "next/cache";
// 1. IMPORTANTE: Importar los tipos
import { Database } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export async function markMessageAsRead(id: string) {
  // 2. CORRECCIÓN: Castear el cliente con tus tipos de base de datos
  const supabase = (await createClient()) as unknown as SupabaseClient<Database>;

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true }) // Ahora TypeScript sabrá que 'is_read' sí existe y es boolean
    .eq("id", id);

  if (error) {
    console.error("Error marcando como leído:", error);
    throw new Error("No se pudo actualizar el mensaje");
  }

  revalidatePath("/dashboard/messages");
}