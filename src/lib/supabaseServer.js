import { createClient } from "@supabase/supabase-js";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // 🔐 ważne: klucz serwisowy
);

// ✅ Funkcja zwraca użytkownika z Supabase + ewentualnie jego dane z tabeli `users`
export async function getUserFromSession() {
  const {
    data: { user },
  } = await supabaseServer.auth.getUser();

  if (!user) return null;

  // Pobierz profil użytkownika (np. role, credits)
  const { data: profile } = await supabaseServer
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
}

export { supabaseServer };
