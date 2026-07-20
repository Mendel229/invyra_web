// Fonctions de lecture — pas de "use server", appelables depuis Server Components directement
import { supabaseAdmin } from "@/lib/supabase";

export async function getDbTemplates() {
  const { data, error } = await supabaseAdmin
    .from("event_templates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
