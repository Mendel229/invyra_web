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

export interface DashboardStats {
  totalUsers: number;
  usersByAccountType: Record<string, number>;
  totalEvents: number;
  eventsByStatus: Record<string, number>;
  totalGuests: number;
  totalTemplates: number;
  activeTemplates: number;
  invitationsSent: number;
  invitationsViewed: number;
  guestsConfirmed: number;
}

async function countRows(table: string) {
  const { count, error } = await supabaseAdmin
    .from(table)
    .select("id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

function tally(values: (string | null)[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const value of values) {
    const key = value ?? "inconnu";
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

/** Stats agrégées pour la page d'accueil de l'admin — tout en lecture seule. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalUsers,
    totalEvents,
    totalGuests,
    totalTemplates,
    activeTemplates,
    usersRes,
    eventsRes,
    eventTotalsRes,
  ] = await Promise.all([
    countRows("users"),
    countRows("events"),
    countRows("guests"),
    countRows("event_templates"),
    supabaseAdmin
      .from("event_templates")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .then((r) => r.count ?? 0),
    supabaseAdmin.from("users").select("account_type"),
    supabaseAdmin.from("events").select("status"),
    supabaseAdmin.from("events").select("invitations_sent, invitations_viewed, guests_confirmed"),
  ]);

  if (usersRes.error) throw new Error(usersRes.error.message);
  if (eventsRes.error) throw new Error(eventsRes.error.message);
  if (eventTotalsRes.error) throw new Error(eventTotalsRes.error.message);

  const eventTotals = (eventTotalsRes.data ?? []).reduce(
    (acc, row) => {
      acc.sent += row.invitations_sent ?? 0;
      acc.viewed += row.invitations_viewed ?? 0;
      acc.confirmed += row.guests_confirmed ?? 0;
      return acc;
    },
    { sent: 0, viewed: 0, confirmed: 0 },
  );

  return {
    totalUsers,
    usersByAccountType: tally((usersRes.data ?? []).map((u) => u.account_type)),
    totalEvents,
    eventsByStatus: tally((eventsRes.data ?? []).map((e) => e.status)),
    totalGuests,
    totalTemplates,
    activeTemplates,
    invitationsSent: eventTotals.sent,
    invitationsViewed: eventTotals.viewed,
    guestsConfirmed: eventTotals.confirmed,
  };
}

export async function getRecentEvents(limit = 8) {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("id, name, event_type, status, guests_count, invitations_sent, created_at, users(username, full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRecentUsers(limit = 8) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, username, full_name, account_type, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id, username, full_name, account_type, language, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface MonthlyCount {
  month: string; // ex: "janv."
  count: number;
}

/** Nombre d'événements créés par mois, sur les `months` derniers mois. */
export async function getEventsPerMonth(months = 6): Promise<MonthlyCount[]> {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabaseAdmin
    .from("events")
    .select("created_at")
    .gte("created_at", since.toISOString());
  if (error) throw new Error(error.message);

  const buckets = new Map<string, number>();
  const labels: string[] = [];
  const cursor = new Date(since);
  for (let i = 0; i < months; i++) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}`;
    const label = cursor.toLocaleDateString("fr-FR", { month: "short" });
    buckets.set(key, 0);
    labels.push(label);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  for (const row of data ?? []) {
    const d = new Date(row.created_at as string);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([, count], i) => ({
    month: labels[i],
    count,
  }));
}

export async function getAllEvents() {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select(
      "id, name, event_type, status, guests_count, invitations_sent, invitations_viewed, guests_confirmed, created_at, event_date, users(username, full_name)",
    )
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
