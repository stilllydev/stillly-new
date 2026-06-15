import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseConfig } from "@/lib/site";

/**
 * Server Supabase client for Server Components, Route Handlers and Server Actions.
 * Reads/writes the auth session from cookies.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — safe to ignore; middleware refreshes the session.
          }
        },
      },
    }
  );
}

/** True when Supabase is configured. Lets the UI degrade gracefully pre-setup. */
export function isSupabaseConfigured() {
  return !!supabaseConfig.url && !!supabaseConfig.anonKey;
}

/** The owner's Supabase auth UUID — the only account allowed into /admin. */
export function getAdminUserId() {
  return supabaseConfig.adminUserId;
}
