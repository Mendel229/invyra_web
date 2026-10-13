"use server";

import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { TEMPLATES_BY_KEY } from "@/lib/templates-registry";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";

/**
 * Garde défense-en-profondeur : le middleware protège déjà /admin/**,
 * mais les Server Actions sont aussi des endpoints HTTP appelables
 * directement, donc chaque mutation revérifie la session admin.
 */
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await isValidAdminSessionToken(token))) {
    throw new Error("Unauthorized");
  }
}

export async function getDbTemplates() {
  const { data, error } = await supabaseAdmin
    .from("event_templates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Crée un template depuis le registre via RPC SECURITY DEFINER */
export async function createTemplateFromRegistry(webTemplateKey: string) {
  await requireAdmin();

  const entry = TEMPLATES_BY_KEY[webTemplateKey];
  if (!entry) throw new Error("Template not found: " + webTemplateKey);

  const { error } = await supabaseAdmin.rpc("admin_insert_template", {
    template_data: {
      name: entry.name,
      description: entry.description,
      event_type: entry.event_type,
      tier: entry.tier,
      web_template_key: entry.web_template_key,
      sort_order: entry.sort_order,
      is_animated: entry.is_animated,
      is_popular: false,
      is_active: true,
      config: {
        defaultColors: entry.default_colors,
        customFields: entry.custom_fields,
        demoImages: entry.demo_images,
      },
      preview_images: entry.demo_images.map(
        (img) => "/templates/" + entry.web_template_key + "/" + img
      ),
    },
  });
  if (error) throw new Error(error.message);
}

/** Met à jour un template via RPC SECURITY DEFINER */
export async function updateTemplate(id: string, updates: Record<string, unknown>) {
  await requireAdmin();

  const allowed = [
    "name", "description", "event_type", "tier", "web_template_key",
    "sort_order", "is_animated", "is_popular", "is_active",
    "config", "preview_url",
  ];
  const filtered: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) filtered[key] = updates[key];
  }

  const { error } = await supabaseAdmin.rpc("admin_update_template", {
    template_id: id,
    updates: filtered,
  });
  if (error) throw new Error(error.message);
}

export async function toggleTemplateActive(id: string, isActive: boolean) {
  return updateTemplate(id, { is_active: isActive });
}

/** Supprime un template via RPC SECURITY DEFINER */
export async function deleteTemplate(id: string) {
  await requireAdmin();

  const { error } = await supabaseAdmin.rpc("admin_delete_template", {
    template_id: id,
  });
  if (error) throw new Error(error.message);
}

/** Crée un template manuel via RPC SECURITY DEFINER */
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
  await requireAdmin();

  const { error } = await supabaseAdmin.rpc("admin_insert_template", {
    template_data: {
      ...payload,
      is_active: true,
      preview_images: [],
    },
  });
  if (error) throw new Error(error.message);
}

const ACCOUNT_TYPES = ["gratuit", "essentiel", "flex"] as const;
export type AccountType = (typeof ACCOUNT_TYPES)[number];

/** Change le palier d'un utilisateur (gratuit / essentiel / flex). */
export async function updateUserAccountType(userId: string, accountType: AccountType) {
  await requireAdmin();

  if (!ACCOUNT_TYPES.includes(accountType)) {
    throw new Error("Palier invalide: " + accountType);
  }

  const { error } = await supabaseAdmin
    .from("users")
    .update({ account_type: accountType })
    .eq("id", userId);
  if (error) throw new Error(error.message);
}
