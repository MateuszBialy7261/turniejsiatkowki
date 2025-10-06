import { createClient } from "@supabase/supabase-js";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// 🔹 Klient serwisowy (do operacji administracyjnych)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 🔐 klucz serwisowy
);

// 🔹 Funkcja pomocnicza do pobierania użytkownika z sesji Supabase
export async function getUserFromSession() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return user;
}

export { supabaseServer };
