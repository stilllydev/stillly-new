"use client";

import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "@/lib/site";

/**
 * Browser Supabase client (public anon key — safe to expose; RLS governs access).
 * Reads from env or the baked-in values in lib/site.ts.
 */
export function createClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
