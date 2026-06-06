import { createClient } from '@supabase/supabase-js';

function getSupabaseUrl() {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error('Missing env: SUPABASE_URL');
  return url;
}

function getAnonKey() {
  const key = process.env.SUPABASE_ANON_KEY;
  if (!key) throw new Error('Missing env: SUPABASE_ANON_KEY');
  return key;
}

function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
  return key;
}

// Client public (anon) — pour les usages client-side ou avec RLS
export const supabase = createClient(getSupabaseUrl(), getAnonKey());

// Client admin (service_role) — uniquement pour les Server Components / Server Actions
// Ne jamais exposer côté client
export const supabaseAdmin = createClient(getSupabaseUrl(), getServiceRoleKey(), {
  auth: { persistSession: false },
  db: { schema: 'public' },
});
