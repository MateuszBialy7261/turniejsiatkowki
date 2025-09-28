// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

let supabase = null;

export function getSupabaseClient() {
  if (supabase) return supabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("❌ Brak konfiguracji Supabase. Sprawdź zmienne środowiskowe.");
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
