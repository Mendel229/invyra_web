"use client";

import { useState, useTransition } from "react";
import {
  createTemplateFromRegistry,
  updateTemplate,
  toggleTemplateActive,
  deleteTemplate,
  createTemplateManual,
} from "@/lib/admin-actions";
import { TEMPLATES_BY_KEY, TemplateRegistryEntry } from "@/lib/templates-registry";

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
  gratuit: "bg-green-100 text-green-700",
  premium: "bg-purple-100 text-purple-700",
};

// ─── Composants utilitaires ───────────────────────────────────────────────────
function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

function Btn({
  onClick, children, variant = "default", disabled = false, className = "",
}: {
  onClick?: () => void; children: React.ReactNode;
  variant?: "default" | "danger" | "ghost" | "success";
  disabled?: boolean; className?: string;
}) {
  const base = "px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    default: "bg-[#5B21B6] text-white hover:bg-[#4C1D95]",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    success: "bg-green-500 text-white hover:bg-green-600",
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
  const [isPending, startTransition] = useTransition();
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

  const handleSave = () => {
    setError("");
    let config: Record<string, unknown> = {};
    try {
      config = JSON.parse(configJson);
      setJsonError("");
    } catch {
      setJsonError("JSON invalide — vérifiez la syntaxe");
      return;
    }

    startTransition(async () => {
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
      }
    });
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5B21B6] bg-white";
  const labelCls = "block text-xs font-semibold text-gray-500 mb-1";

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
          <h2 className="text-lg font-bold text-gray-900">
            {isNew ? "Nouveau template" : `Modifier — ${template?.name}`}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>}

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
            <p className="text-xs text-green-600 mt-1">✓ Trouvé dans le registre — champs pré-remplis</p>
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
          <label className={labelCls}>Type d'événement *</label>
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
                  className="accent-[#5B21B6]"
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
            <label className={labelCls}>Ordre d'affichage</label>
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
                className="accent-[#5B21B6]"
              />
              <span className="text-sm text-gray-700">Animé</span>
            </label>
          </div>
          <div className="flex flex-col gap-2 pt-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_popular ?? false}
                onChange={(e) => set("is_popular", e.target.checked)}
                className="accent-[#5B21B6]"
              />
              <span className="text-sm text-gray-700">Populaire</span>
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
              className="accent-[#5B21B6]"
            />
            <span className="text-sm font-semibold text-gray-700">Actif (visible dans l'app)</span>
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
                className="text-[10px] text-[#5B21B6] hover:underline font-semibold"
              >
                ↺ Recharger depuis le registre
              </button>
            )}
          </div>
          <textarea
            value={configJson}
            onChange={(e) => { setConfigJson(e.target.value); setJsonError(""); }}
            className={`${inputCls} h-48 font-mono text-xs resize-y ${jsonError ? "border-red-400" : ""}`}
          />
          {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
          <p className="text-gray-400 text-xs mt-1">
            Exemples de clés : defaultColors, customFields, demoImages
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Btn onClick={handleSave} disabled={isPending} className="flex-1">
            {isPending ? "Enregistrement..." : isNew ? "Créer le template" : "Enregistrer"}
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
  const [unregistered, setUnregistered] = useState<TemplateRegistryEntry[]>(unregisteredTemplates);
  const [editTarget, setEditTarget] = useState<DbTemplate | null | undefined>(undefined); // undefined = fermé
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const refresh = async () => {
    // Re-fetch via Server Action
    const { getDbTemplates } = await import("@/lib/admin-actions");
    const fresh = await getDbTemplates();
    setTemplates(fresh);
    const freshKeys = new Set(fresh.map((t: DbTemplate) => t.web_template_key));
    setUnregistered(
      (unregisteredTemplates).filter((t) => !freshKeys.has(t.web_template_key))
    );
  };

  const handleRegister = (key: string) => {
    startTransition(async () => {
      try {
        await createTemplateFromRegistry(key);
        await refresh();
        showToast(`Template "${key}" enregistré en base ✓`);
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : "Erreur", "err");
      }
    });
  };

  const handleToggle = (id: string, current: boolean) => {
    startTransition(async () => {
      try {
        await toggleTemplateActive(id, !current);
        setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, is_active: !current } : t));
        showToast(`Template ${!current ? "activé" : "désactivé"} ✓`);
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : "Erreur", "err");
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" de la base ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      try {
        await deleteTemplate(id);
        setTemplates((prev) => prev.filter((t) => t.id !== id));
        showToast(`"${name}" supprimé ✓`);
      } catch (e: unknown) {
        showToast(e instanceof Error ? e.message : "Erreur", "err");
      }
    });
  };

  const grouped = EVENT_TYPES.reduce<Record<string, DbTemplate[]>>((acc, type) => {
    acc[type] = templates.filter((t) => t.event_type === type);
    return acc;
  }, {});

  const EVENT_TYPES_LIST = ["mariage", "anniversaire", "bapteme", "soiree_vip", "corporate", "autre"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${
          toast.type === "ok" ? "bg-green-500" : "bg-red-500"
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#5B21B6] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-black">I</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Admin — Templates</h1>
            <p className="text-xs text-gray-400">{templates.length} templates en base</p>
          </div>
        </div>
        <Btn onClick={() => setEditTarget(null)}>+ Nouveau template</Btn>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* ── Templates non enregistrés ── */}
        {unregistered.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <h2 className="font-bold text-gray-800">
                Dans le code, pas encore en base ({unregistered.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unregistered.map((t) => (
                <div key={t.web_template_key} className="bg-white rounded-2xl border border-amber-200 p-4 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.web_template_key}</p>
                    </div>
                    <Badge className={TIER_COLORS[t.tier]}>{t.tier}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{t.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-700">{EVENT_TYPE_LABELS[t.event_type]}</Badge>
                    {t.is_animated && <Badge className="bg-gray-100 text-gray-600">Animé</Badge>}
                  </div>
                  <Btn
                    onClick={() => handleRegister(t.web_template_key)}
                    disabled={isPending}
                    variant="success"
                    className="w-full justify-center"
                  >
                    ↑ Enregistrer en base
                  </Btn>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Templates en base par catégorie ── */}
        {EVENT_TYPES_LIST.map((type) => {
          const list = grouped[type] ?? [];
          if (list.length === 0) return null;
          return (
            <section key={type}>
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#5B21B6]" />
                {EVENT_TYPE_LABELS[type]} ({list.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {list.map((t) => (
                  <div
                    key={t.id}
                    className={`bg-white rounded-2xl border p-4 flex flex-col gap-3 transition-all ${
                      t.is_active ? "border-gray-200" : "border-gray-100 opacity-60"
                    }`}
                  >
                    {/* Preview image */}
                    {t.preview_url && (
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-100">
                        <img src={t.preview_url} alt={t.name} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{t.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{t.web_template_key ?? "—"}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <Badge className={TIER_COLORS[t.tier]}>{t.tier}</Badge>
                        {!t.is_active && <Badge className="bg-gray-100 text-gray-400">Inactif</Badge>}
                        {t.is_popular && <Badge className="bg-amber-100 text-amber-600">⭐ Populaire</Badge>}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{t.description}</p>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {t.is_animated && <Badge className="bg-gray-100 text-gray-600">Animé</Badge>}
                      <Badge className="bg-gray-100 text-gray-500">#{t.sort_order}</Badge>
                    </div>

                    {/* Aperçu web */}
                    {t.web_template_key && (
                      <a
                        href={`/preview/${t.web_template_key}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#5B21B6] hover:underline font-semibold"
                      >
                        👁 Voir l'aperçu →
                      </a>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Btn onClick={() => setEditTarget(t)} variant="ghost" className="flex-1 text-center">
                        ✏️ Modifier
                      </Btn>
                      <Btn
                        onClick={() => handleToggle(t.id, t.is_active)}
                        variant={t.is_active ? "ghost" : "success"}
                        disabled={isPending}
                      >
                        {t.is_active ? "Désactiver" : "Activer"}
                      </Btn>
                      <Btn
                        onClick={() => handleDelete(t.id, t.name)}
                        variant="danger"
                        disabled={isPending}
                      >
                        🗑
                      </Btn>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {templates.length === 0 && unregistered.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg mb-2">Aucun template</p>
            <p className="text-sm">Créez votre premier template ou enregistrez ceux du code.</p>
          </div>
        )}
      </div>
    </div>
  );
}
