// Fonctions de lecture — pas de "use server", appelables depuis Server Components directement.
// "server-only" interdit tout import de ce module (et donc de la clé service_role) dans un bundle client.
import "server-only";
import { supabaseAdmin } from "@/lib/supabase";

export async function getDbTemplates() {
  const { data, error } = await supabaseAdmin
    .from("event_templates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
