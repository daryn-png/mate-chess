import { createBrowserClient } from '@supabase/ssr';

// Client-side Supabase client (use in components)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Singleton for client components
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!client) client = createClient();
  return client;
}
