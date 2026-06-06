import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client public (anon) — pour les usages client-side ou avec RLS
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin (service_role) — uniquement pour les Server Components / Server Actions
// Ne jamais exposer côté client
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});