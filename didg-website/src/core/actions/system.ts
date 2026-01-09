"use server";

import { createAdminClient } from "@/infrastructure/supabase/admin";

export async function getSystemStatus() {
  const supabase = createAdminClient();
  const start = Date.now();

  // 1. VERIFICAR BASE DE DATOS (Intentamos contar usuarios)
  let dbStatus = "offline";
  let dbCount = 0;
  let dbLatency = 0;

  try {
    const dbStart = Date.now();
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });
    
    if (!error) {
      dbStatus = "online";
      dbCount = count || 0;
      dbLatency = Date.now() - dbStart;
    }
  } catch (e) {
    dbStatus = "error";
  }

  // 2. VERIFICAR STORAGE (Intentamos listar los buckets)
  let storageStatus = "offline";
  let bucketCount = 0;
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (!error && buckets) {
      storageStatus = "online";
      bucketCount = buckets.length;
    }
  } catch (e) {
    storageStatus = "error";
  }

  return {
    db: { status: dbStatus, count: dbCount, latency: dbLatency },
    storage: { status: storageStatus, buckets: bucketCount },
    timestamp: new Date().toISOString()
  };
}