"use client";

import { useState } from "react";
import { Palette } from "lucide-react";
import {
  createTemplateFromRegistry,
  updateTemplate,
  toggleTemplateActive,
  deleteTemplate,
  createTemplateManual,
} from "@/lib/admin-actions";
import { TEMPLATES_BY_KEY, TemplateRegistryEntry } from "@/lib/templates-registry";
import { PageHeader, Panel, EmptyState, StatusBadge } from "../components";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DbTemplate {
  id: string;
  name: string;
  description: string;
  event_type: string;
  tier: string;
  web_template_key: string | null;
  sort_order: number;
  is_active: boolean;
  is_popular: boolean;
  is_animated: boolean;
  config: Record<string, unknown>;
  preview_url: string | null;
  preview_images: string[];
  created_at: string;
  updated_at: string;
}

interface Props {
  dbTemplates: DbTemplate[];
  unregisteredTemplates: TemplateRegistryEntry[];
  eventTypeLabels: Record<string, string>;
}

const TIERS = ["gratuit", "premium"];
const EVENT_TYPES = ["mariage", "anniversaire", "bapteme", "soiree_vip", "corporate", "autre"];
const EVENT_TYPE_LABELS: Record<string, string> = {
  mariage: "Mariage", anniversaire: "Anniversaire", bapteme: "Baptême",
  soiree_vip: "Soirée VIP", corporate: "Corporate", autre: "Autre",
};
const TIER_COLORS: Record<string, string> = {
  gratuit: "bg-noir-doux/5 text-noir-doux/60 ring-1 ring-noir-doux/10",
  premium: "bg-or-africain/15 text-or-africain ring-1 ring-or-africain/30",
};

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Btn({
  onClick, children, variant = "default", disabled = false, className = "",
}: {
  onClick?: () => void; children: React.ReactNode;
  variant?: "default" | "danger" | "ghost" | "success";
  disabled?: boolean; className?: string;
}) {
  const base = "px-3.5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-violet-royal text-white hover:bg-violet-royal-alt shadow-sm shadow-violet-royal/20",
    danger: "bg-brand-error/10 text-brand-error hover:bg-brand-error/15",
    ghost: "bg-noir-doux/5 text-noir-doux/70 hover:bg-noir-doux/10",
    success: "bg-brand-success text-white hover:bg-brand-success/90 shadow-sm shadow-brand-success/20",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

// ─── Panel d'édition ──────────────────────────────────────────────────────────
function EditPanel({
  template, onClose, onSaved,
}: { template: DbTemplate | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<DbTemplate>>(template ?? {
    name: "", description: "", event_type: "mariage", tier: "gratuit",
    web_template_key: "", sort_order: 0, is_animated: false, is_popular: false, is_active: true,
    config: {},
  });

  // Initialiser configJson : si config est vide ET que la clé est dans le registre,
  // pré-remplir depuis le registre automatiquement
  const getInitialConfig = () => {
    const existingConfig = template?.config;
    const hasConfig = existingConfig && Object.keys(existingConfig).length > 0;
    if (hasConfig) return JSON.stringify(existingConfig, null, 2);

    // Config vide — chercher dans le registre
    const key = template?.web_template_key;
    if (key) {
      const reg = TEMPLATES_BY_KEY[key];
      if (reg) {
        return JSON.stringify({
          defaultColors: reg.default_colors,
          customFields: reg.custom_fields,
          demoImages: reg.demo_images,
        }, null, 2);
      }
    }
    return "{}";
  };

  const [configJson, setConfigJson] = useState(getInitialConfig);
  const [jsonError, setJsonError] = useState("");
  const [error, setError] = useState("");
  const isNew = !template;

  const set = (key: keyof DbTemplate, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");
    let config: Record<string, unknown> = {};
    try {
      config = JSON.parse(configJson);
      setJsonError("");
    } catch {
      setJsonError("JSON invalide — vérifiez la syntaxe");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await createTemplateManual({
          name: form.name ?? "",
          description: form.description ?? "",
          event_type: form.event_type ?? "autre",
          tier: form.tier ?? "gratuit",
          web_template_key: form.web_template_key ?? "",
          sort_order: form.sort_order ?? 0,
          is_animated: form.is_animated ?? false,
          is_popular: form.is_popular ?? false,
          config,
        });
      } else {
        await updateTemplate(template!.id, { ...form, config });
      }
      onSaved();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full ring-1 ring-black/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-royal bg-white text-noir-doux transition-shadow";
  const labelCls = "block text-xs font-semibold text-noir-doux/50 mb-1";

  // Auto-remplir depuis le registre si web_template_key est reconnu
  const handleKeyChange = (key: string) => {
    set("web_template_key", key);
    const reg = TEMPLATES_BY_KEY[key];
    if (reg && isNew) {
      setForm((prev) => ({
        ...prev,
        name: reg.name,
        description: reg.description,
        event_type: reg.event_type,
        tier: reg.tier,
        sort_order: reg.sort_order,
        is_animated: reg.is_animated,
        web_template_key: key,
      }));
      setConfigJson(JSON.stringify({
        defaultColors: reg.default_colors,
        customFields: reg.custom_fields,
        demoImages: reg.demo_images,
      }, null, 2));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-end" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-noir-doux">
            {isNew ? "Nouveau template" : `Modifier — ${template?.name}`}
          </h2>
          <button onClick={onClose} className="flex size-8 items-center justify-center rounded-full text-noir-doux/40 hover:bg-noir-doux/5 hover:text-noir-doux text-xl">×</button>
        </div>

        {error && <p className="text-sm text-brand-error bg-brand-error/10 p-2 rounded-xl">{error}</p>}

        {/* Clé web — avec auto-complétion registre */}
        <div>
          <label className={labelCls}>Clé web (web_template_key) *</label>
          <input
            value={form.web_template_key ?? ""}
            onChange={(e) => handleKeyChange(e.target.value)}
            className={inputCls}
            placeholder="ex: birthday-party"
            list="registry-keys"
          />
          <datalist id="registry-keys">
            {Object.keys(TEMPLATES_BY_KEY).map((k) => <option key={k} value={k} />)}
          </datalist>
          {form.web_template_key && TEMPLATES_BY_KEY[form.web_template_key as string] && (
            <p className="text-xs text-brand-success mt-1">✓ Trouvé dans le registre — champs pré-remplis</p>
          )}
        </div>

        {/* Nom */}
        <div>
          <label className={labelCls}>Nom *</label>
          <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} className={inputCls} />
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            className={`${inputCls} h-20 resize-none`}
          />
        </div>

        {/* Type d'événement */}
        <div>
          <label className={labelCls}>Type d&apos;événement *</label>
          <select
            value={form.event_type ?? ""}
            onChange={(e) => set("event_type", e.target.value)}
            className={inputCls}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>{EVENT_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* Tier — Radio */}
        <div>
          <label className={labelCls}>Offre *</label>
          <div className="flex gap-3">
            {TIERS.map((tier) => (
              <label key={tier} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tier"
                  value={tier}
                  checked={form.tier === tier}
                  onChange={() => set("tier", tier)}
                  className="accent-violet-royal"
                />
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIER_COLORS[tier]}`}>
                  {tier === "gratuit" ? "Gratuit" : "Premium"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Ordre + Animé + Populaire */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className={labelCls}>Ordre d&apos;affichage</label>
            <input
              type="number"
              value={form.sort_order ?? 0}
              onChange={(e) => set("sort_order", parseInt(e.target.value, 10))}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_animated ?? false}
                onChange={(e) => set("is_animated", e.target.checked)}
                className="accent-violet-royal"
              />
              <span className="text-sm text-noir-doux/70">Animé</span>
            </label>
          </div>
          <div className="flex flex-col gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_popular ?? false}
                onChange={(e) => set("is_popular", e.target.checked)}
                className="accent-violet-royal"
              />
              <span className="text-sm text-noir-doux/70">Populaire</span>
            </label>
          </div>
        </div>

        {/* Statut actif */}
        {!isNew && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active ?? true}
              onChange={(e) => set("is_active", e.target.checked)}
              className="accent-violet-royal"
            />
            <span className="text-sm font-semibold text-noir-doux/70">Actif (visible dans l&apos;app)</span>
          </label>
        )}

        {/* Config JSON */}
        <div>
          <label className={labelCls}>Configuration JSON (couleurs, champs perso, images démo)</label>
          <div className="flex items-center justify-between mb-1">
            <label className={labelCls}>Configuration JSON</label>
            {form.web_template_key && TEMPLATES_BY_KEY[form.web_template_key as string] && (
              <button
                type="button"
                onClick={() => {
                  const reg = TEMPLATES_BY_KEY[form.web_template_key as string];
                  setConfigJson(JSON.stringify({
                    defaultColors: reg.default_colors,
                    customFields: reg.custom_fields,
                    demoImages: reg.demo_images,
                  }, null, 2));
                  setJsonError("");
                }}
                className="text-[10px] text-violet-royal hover:underline font-semibold"
              >
                ↺ Recharger depuis le registre
              </button>
            )}
          </div>
          <textarea
            value={configJson}
            onChange={(e) => { setConfigJson(e.target.value); setJsonError(""); }}
            className={`${inputCls} h-48 font-mono text-xs resize-y ${jsonError ? "ring-2 ring-brand-error" : ""}`}
          />
          {jsonError && <p className="text-brand-error text-xs mt-1">{jsonError}</p>}
          <p className="text-noir-doux/40 text-xs mt-1">
            Exemples de clés : defaultColors, customFields, demoImages
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Btn onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? "Enregistrement..." : isNew ? "Créer le template" : "Enregistrer"}
          </Btn>
          <Btn onClick={onClose} variant="ghost">Annuler</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminTemplatesClient({ dbTemplates, unregisteredTemplates }: Props) {
  const [templates, setTemplates] = useState<DbTemplate[]>(dbTemplates);
  const [unregistered] = useState<TemplateRegistryEntry[]>(unregisteredTemplates);
  const [editTarget, setEditTarget] = useState<DbTemplate | null | undefined>(undefined);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [busy, setBusy] = useState(false);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = () => {
    // Recharger la page pour voir les données fraîches depuis le serveur
    window.location.reload();
  };

  const handleRegister = async (key: string) => {
    try {
      await createTemplateFromRegistry(key);
      refresh();
      showToast(`Template "${key}" enregistre en base`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "err");
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await toggleTemplateActive(id, !current);
      setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, is_active: !current } : t));
      showToast(`Template ${!current ? "active" : "desactive"}`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "err");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ? Cette action est irreversible.`)) return;
    try {
      await deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      showToast(`"${name}" supprime`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Erreur", "err");
    }
  };

  const sorted = [...templates].sort((a, b) => {
    if (a.event_type !== b.event_type) return a.event_type.localeCompare(b.event_type);
    return a.sort_order - b.sort_order;
  });

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${
          toast.type === "ok" ? "bg-brand-success" : "bg-brand-error"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Panel d'édition */}
      {editTarget !== undefined && (
        <EditPanel
          template={editTarget}
          onClose={() => setEditTarget(undefined)}
          onSaved={async () => { await refresh(); showToast("Sauvegardé ✓"); }}
        />
      )}

      <PageHeader
        title="Templates"
        subtitle={`${templates.length} template(s) en base`}
        action={<Btn onClick={() => setEditTarget(null)}>+ Nouveau template</Btn>}
      />

      {/* ── Templates non enregistrés ── */}
      {unregistered.length > 0 && (
        <Panel>
          <div className="px-5 pt-5">
            <h2 className="text-sm font-semibold text-noir-doux">
              Dans le code, pas encore en base ({unregistered.length})
            </h2>
            <p className="mt-0.5 text-xs text-noir-doux/50">
              Ces modèles existent dans le code mais ne sont pas encore visibles dans l&apos;app.
            </p>
          </div>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-noir-doux/40 border-b border-black/5">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Clé web</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Offre</th>
                  <th className="px-5 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {unregistered.map((t) => (
                  <tr key={t.web_template_key} className="border-b border-black/5 last:border-0 hover:bg-beige-creme-alt/40">
                    <td className="px-5 py-3 font-semibold text-noir-doux">{t.name}</td>
                    <td className="px-5 py-3 text-noir-doux/50 font-mono text-xs">{t.web_template_key}</td>
                    <td className="px-5 py-3 text-noir-doux/60">{EVENT_TYPE_LABELS[t.event_type]}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.tier} /></td>
                    <td className="px-5 py-3 text-right">
                      <Btn onClick={() => handleRegister(t.web_template_key)} disabled={busy} variant="success">
                        Enregistrer en base
                      </Btn>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {/* ── Templates en base ── */}
      <Panel>
        {sorted.length === 0 ? (
          <EmptyState
            icon={<Palette />}
            title="Aucun template"
            description="Créez votre premier template ou enregistrez ceux du code."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-noir-doux/40 border-b border-black/5">
                  <th className="px-5 py-3 font-medium">Nom</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Offre</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 font-medium">Ordre</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <tr key={t.id} className={`border-b border-black/5 last:border-0 hover:bg-beige-creme-alt/40 ${t.is_active ? "" : "opacity-50"}`}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-noir-doux">
                        {t.name}
                        {t.is_popular && <span className="ml-1.5 text-or-africain" title="Populaire">★</span>}
                      </p>
                      <p className="text-xs text-noir-doux/40">{t.web_template_key ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3 text-noir-doux/60">{EVENT_TYPE_LABELS[t.event_type]}</td>
                    <td className="px-5 py-3"><StatusBadge status={t.tier} /></td>
                    <td className="px-5 py-3"><StatusBadge status={t.is_active ? "actif" : "inactif"} /></td>
                    <td className="px-5 py-3 text-noir-doux/50">#{t.sort_order}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {t.web_template_key && (
                          <a
                            href={`/preview/${t.web_template_key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-violet-royal hover:bg-violet-royal/8"
                          >
                            Aperçu
                          </a>
                        )}
                        <button
                          onClick={() => setEditTarget(t)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-noir-doux/70 hover:bg-noir-doux/5"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleToggle(t.id, t.is_active)}
                          disabled={busy}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-noir-doux/70 hover:bg-noir-doux/5 disabled:opacity-50"
                        >
                          {t.is_active ? "Désactiver" : "Activer"}
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.name)}
                          disabled={busy}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-error hover:bg-brand-error/8 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
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
