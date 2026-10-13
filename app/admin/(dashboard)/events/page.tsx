import { CalendarDays } from "lucide-react";
import { getAllEvents } from "@/lib/admin-queries";
import { PageHeader, Panel, StatusBadge, InitialsAvatar, EmptyState } from "../components";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminEventsPage() {
  const events = await getAllEvents();

  return (
    <div className="space-y-5">
      <PageHeader title="Événements" subtitle={`${events.length} événement(s) créé(s)`} />

      <Panel>
        {events.length === 0 ? (
          <EmptyState icon={<CalendarDays />} title="Aucun événement" description="Les événements créés par les utilisateurs apparaîtront ici." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-noir-doux/40 border-b border-black/5">
                  <th className="px-5 py-3 font-medium">Événement</th>
                  <th className="px-5 py-3 font-medium">Organisateur</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium text-center">Invités</th>
                  <th className="px-5 py-3 font-medium text-center">Envoyées</th>
                  <th className="px-5 py-3 font-medium text-center">Vues</th>
                  <th className="px-5 py-3 font-medium text-center">Confirmés</th>
                  <th className="px-5 py-3 font-medium">Créé le</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const owner = Array.isArray(event.users) ? event.users[0] : event.users;
                  return (
                    <tr key={event.id} className="border-b border-black/5 last:border-0 hover:bg-beige-creme-alt/40">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <InitialsAvatar name={event.name} className="size-9 text-xs" />
                          <span className="font-semibold text-noir-doux">{event.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-noir-doux/60">{owner?.full_name ?? owner?.username ?? "—"}</td>
                      <td className="px-5 py-3 text-noir-doux/60 capitalize">{event.event_type?.replace("_", " ") ?? "—"}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={event.status} />
                      </td>
                      <td className="px-5 py-3 text-center text-noir-doux/60">{event.guests_count ?? 0}</td>
                      <td className="px-5 py-3 text-center text-noir-doux/60">{event.invitations_sent ?? 0}</td>
                      <td className="px-5 py-3 text-center text-noir-doux/60">{event.invitations_viewed ?? 0}</td>
                      <td className="px-5 py-3 text-center text-noir-doux/60">{event.guests_confirmed ?? 0}</td>
                      <td className="px-5 py-3 text-noir-doux/60">{formatDate(event.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
