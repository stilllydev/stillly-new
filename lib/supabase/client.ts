"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client (uses the public anon key).
 * Safe to expose: row-level security governs what the anon role can do.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
