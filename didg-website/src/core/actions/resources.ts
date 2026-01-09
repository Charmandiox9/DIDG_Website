"use server";

import { createClient } from "@/infrastructure/supabase/client";

export async function getExtraResources() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from("extra_resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}