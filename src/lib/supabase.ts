import { createClient } from "@supabase/supabase-js";

// The connection to the team's database (Supabase).
// The values come from .env.local, never write them into the code.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient(
  url ?? "https://missing.supabase.co",
  anonKey ?? "missing-key",
);
