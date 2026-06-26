"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { TEMPLATES_BY_KEY } from "@/lib/templates-registry";

/** Récupère tous les templates depuis la BDD */
export async function getDbTemplates() {
  const { data, error } = await supabaseAdmin
    .from("event_templates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Crée un template en BDD depuis le registre du code */
export async function createTemplateFromRegistry(webTemplateKey: string) {
  const entry = TEMPLATES_BY_KEY[webTemplateKey];
  if (!entry) throw new Error(`Template "${webTemplateKey}" introuvable dans le registre`);

  const { error } = await supabaseAdmin.from("event_templates").insert({
    name: entry.name,
    description: entry.description,
    event_type: entry.event_type,
    tier: entry.tier,
    web_template_key: entry.web_template_key,
    sort_order: entry.sort_order,
    is_animated: entry.is_animated,
    is_active: true,
    is_popular: false,
    tags: [],
    config: {
      defaultColors: entry.default_colors,
      customFields: entry.custom_fields,
      demoImages: entry.demo_images,
    },
    preview_images: entry.demo_images.map(
      (img) => `/templates/${entry.web_template_key}/${img}`
    ),
  });
  if (error) throw new Error(error.message);
}

/** Met à jour un template existant */
export async function updateTemplate(id: string, updates: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from("event_templates")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Active ou désactive un template */
export async function toggleTemplateActive(id: string, isActive: boolean) {
  return updateTemplate(id, { is_active: isActive });
}

/** Supprime un template de la BDD */
export async function deleteTemplate(id: string) {
  const { error } = await supabaseAdmin
    .from("event_templates")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

/** Crée un template entièrement manuel (sans registre) */
export async function createTemplateManual(payload: {
  name: string;
  description: string;
  event_type: string;
  tier: string;
  web_template_key: string;
  sort_order: number;
  is_animated: boolean;
  is_popular: boolean;
  config: Record<string, unknown>;
}) {
  const { error } = await supabaseAdmin.from("event_templates").insert({
    ...payload,
    is_active: true,
    tags: [],
    preview_images: [],
  });
  if (error) throw new Error(error.message);
}
