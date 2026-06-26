import { getDbTemplates } from "@/lib/admin-actions";
import { TEMPLATES_REGISTRY, TEMPLATES_BY_KEY, EVENT_TYPE_LABELS } from "@/lib/templates-registry";
import AdminTemplatesClient from "./AdminTemplatesClient";

export const dynamic = "force-dynamic";

export default async function AdminTemplatesPage() {
  const dbTemplates = await getDbTemplates();
  const dbKeys = new Set(dbTemplates.map((t: { web_template_key: string }) => t.web_template_key));

  // Templates présents dans le code mais pas encore en BDD
  const unregisteredTemplates = TEMPLATES_REGISTRY.filter(
    (t) => !dbKeys.has(t.web_template_key)
  );

  return (
    <AdminTemplatesClient
      dbTemplates={dbTemplates}
      unregisteredTemplates={unregisteredTemplates}
      eventTypeLabels={EVENT_TYPE_LABELS}
    />
  );
}
