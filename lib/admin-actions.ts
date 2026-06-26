"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { TEMPLATES_BY_KEY } from "@/lib/templates-registry";

export async function getDbTemplates() {
  const { data, error } = await supabaseAdmin
    .from("event_templates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createTemplateFromRegistry(webTemplateKey: string) {
  const entry = TEMPLATES_BY_KEY[webTemplateKey];
  if (!entry) throw new Error("Template not found: " + webTemplateKey);

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
      (img) => "/templates/" + entry.web_template_key + "/" + img
    ),
  });
  if (error) throw new Error(error.message);
}

export async function updateTemplate(id: string, updates: Record<string, unknown>) {
  const allowed = [
    "name", "description", "event_type", "tier", "web_template_key",
    "sort_order", "is_animated", "is_popular", "is_active",
    "config", "preview_url", "preview_images", "tags",
  ];
  const filtered: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key];
  }

  const { error } = await supabaseAdmin
    .from("event_templates")
    .update(filtered)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function toggleTemplateActive(id: string, isActive: boolean) {
  return updateTemplate(id, { is_active: isActive });
}

export async function deleteTemplate(id: string) {
  const { error } = await supabaseAdmin
    .from("event_templates")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

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
