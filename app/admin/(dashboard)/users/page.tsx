import { Users } from "lucide-react";
import { getAllUsers } from "@/lib/admin-queries";
import { PageHeader, Panel, InitialsAvatar, EmptyState } from "../components";
import AccountTypeSelect from "./AccountTypeSelect";

export const dynamic = "force-dynamic";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default async function AdminUsersPage() {
  const users = await getAllUsers();

  return (
    <div className="space-y-5">
      <PageHeader title="Utilisateurs" subtitle={`${users.length} compte(s) inscrit(s)`} />

      <Panel>
        {users.length === 0 ? (
          <EmptyState icon={<Users />} title="Aucun utilisateur" description="Les comptes inscrits apparaîtront ici." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-noir-doux/40 border-b border-black/5">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Identifiant</th>
                  <th className="px-5 py-3 font-medium">Palier</th>
                  <th className="px-5 py-3 font-medium">Langue</th>
                  <th className="px-5 py-3 font-medium">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-black/5 last:border-0 hover:bg-beige-creme-alt/40">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <InitialsAvatar name={user.full_name ?? user.username ?? "?"} className="size-9 text-xs" />
                        <span className="font-semibold text-noir-doux">{user.full_name ?? "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-noir-doux/60">@{user.username ?? "—"}</td>
                    <td className="px-5 py-3">
                      <AccountTypeSelect userId={user.id} initialValue={user.account_type} />
                    </td>
                    <td className="px-5 py-3 text-noir-doux/60 uppercase">{user.language ?? "—"}</td>
                    <td className="px-5 py-3 text-noir-doux/60">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
