import { createClient } from "@supabase/supabase-js";

// Este cliente IGNORA todas las reglas RLS (Row Level Security).
// Úsalo SOLO en el servidor (Server Actions / Server Components).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}