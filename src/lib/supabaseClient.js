// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Brak konfiguracji Supabase. Sprawdź .env.local oraz zmienne w Vercel.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
