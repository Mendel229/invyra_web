import { CalendarDays, Palette, Sparkles, Users } from "lucide-react";
import { getDashboardStats, getRecentEvents, getRecentUsers, getEventsPerMonth } from "@/lib/admin-queries";
import { PageHeader, Panel, PanelHeader, StatCard, BreakdownBars, StatusBadge, InitialsAvatar, EmptyState, StaggerList, StaggerItem } from "./components";
import EventsChart from "./EventsChart";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminDashboardPage() {
  const [stats, recentEvents, recentUsers, eventsPerMonth] = await Promise.all([
    getDashboardStats(),
    getRecentEvents(5),
    getRecentUsers(5),
    getEventsPerMonth(6),
  ]);

  return (
    <div className="space-y-5">
      <PageHeader title="Bonjour 👋" subtitle="Voici ce qui se passe sur Invyra." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard index={0} highlight label="Événements créés" value={stats.totalEvents} hint={`${stats.totalGuests} invités au total`} icon={<Sparkles />} />
        <StatCard index={1} label="Utilisateurs inscrits" value={stats.totalUsers} icon={<Users />} />
        <StatCard index={2} label="Templates actifs" value={stats.activeTemplates} hint={`${stats.totalTemplates} au total`} icon={<Palette />} />
        <StatCard index={3} label="Invitations confirmées" value={stats.guestsConfirmed} hint={`${stats.invitationsSent} envoyées`} icon={<CalendarDays />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Événements créés" description="6 derniers mois" />
          <div className="px-2 pb-4">
            <EventsChart data={eventsPerMonth} />
          </div>
        </Panel>

        <Panel className="p-5">
          <h2 className="text-base font-semibold text-noir-doux">Comptes par palier</h2>
          <div className="mt-4">
            <BreakdownBars
              data={stats.usersByAccountType}
              total={stats.totalUsers}
              colors={{
                flex: "var(--color-or-africain)",
                essentiel: "var(--color-violet-royal)",
                gratuit: "var(--color-noir-doux)",
              }}
            />
          </div>
          <div className="h-px bg-black/5 my-4" />
          <p className="text-xs font-semibold text-noir-doux/40 uppercase mb-2">Invitations</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-noir-doux">{stats.invitationsSent}</p>
              <p className="text-[11px] text-noir-doux/50">Envoyées</p>
            </div>
            <div>
              <p className="text-lg font-bold text-noir-doux">{stats.invitationsViewed}</p>
              <p className="text-[11px] text-noir-doux/50">Vues</p>
            </div>
            <div>
              <p className="text-lg font-bold text-noir-doux">{stats.guestsConfirmed}</p>
              <p className="text-[11px] text-noir-doux/50">Confirmées</p>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Derniers événements créés" />
          <div className="px-2 pb-2">
            {recentEvents.length === 0 ? (
              <EmptyState icon={<CalendarDays />} title="Aucun événement" description="Les événements créés par les utilisateurs apparaîtront ici." />
            ) : (
              <StaggerList className="flex flex-col divide-y divide-black/5 px-3">
                {recentEvents.map((event) => {
                  const owner = Array.isArray(event.users) ? event.users[0] : event.users;
                  return (
                    <StaggerItem key={event.id} className="flex items-center gap-3 py-3">
                      <InitialsAvatar name={event.name} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-noir-doux truncate">{event.name}</p>
                        <p className="text-xs text-noir-doux/50 truncate">
                          {owner?.full_name ?? owner?.username ?? "—"} · {formatDate(event.created_at)}
                        </p>
                      </div>
                      <StatusBadge status={event.status} />
                    </StaggerItem>
                  );
                })}
              </StaggerList>
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Derniers inscrits" />
          <div className="px-2 pb-2">
            {recentUsers.length === 0 ? (
              <EmptyState icon={<Users />} title="Aucun utilisateur" description="Les nouveaux inscrits apparaîtront ici." />
            ) : (
              <StaggerList className="flex flex-col divide-y divide-black/5 px-3">
                {recentUsers.map((user) => (
                  <StaggerItem key={user.id} className="flex items-center gap-3 py-3">
                    <InitialsAvatar name={user.full_name ?? user.username ?? "?"} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-noir-doux truncate">{user.full_name ?? user.username ?? "—"}</p>
                      <p className="text-xs text-noir-doux/50 truncate">{formatDate(user.created_at)}</p>
                    </div>
                    <StatusBadge status={user.account_type} />
                  </StaggerItem>
                ))}
              </StaggerList>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}
