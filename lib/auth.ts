import { redirect } from "next/navigation";
import { createClient, getAdminUserId } from "@/lib/supabase/server";

/**
 * Server-side admin gate. Returns the owner's user, or redirects to login.
 * Layer #2 of defense-in-depth (middleware is #1, RLS is #3).
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminId = getAdminUserId();
  if (!user) redirect("/admin/login");
  if (adminId && user.id !== adminId) redirect("/admin/login?error=unauthorized");

  return { user, supabase };
}
