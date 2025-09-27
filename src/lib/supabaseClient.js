import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase env vars not loaded:", {
    supabaseUrl,
    supabaseAnonKey: supabaseAnonKey ? "***HIDDEN***" : null,
  });
  throw new Error("Brak konfiguracji Supabase. Sprawdź .env.local");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ jest" : "❌ brak");
