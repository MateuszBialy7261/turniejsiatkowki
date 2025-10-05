// src/lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

// Używamy klucza serwisowego — tylko po stronie backendu (API)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export { supabaseAdmin };
