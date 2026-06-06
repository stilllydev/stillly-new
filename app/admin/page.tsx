import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { deleteProject, togglePublished, signOut } from "./actions";
import type { Project } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-32 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">Admin not configured</h1>
        <p className="mt-3 text-[color:var(--color-fg-dim)]">
          Add your Supabase env vars (see <code>.env.example</code>) and run the SQL in <code>/sql</code> to enable the admin panel.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-[color:var(--color-fg-dim)] hover:text-white">
          ← back home
        </Link>
      </main>
    );
  }

  const { supabase } = await requireAdmin();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("ordering", { ascending: true });
  const projects = (data ?? []) as Project[];

  return (
    <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] text-[color:var(--color-fg-faint)]">
            Admin
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
            Projects
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects/new"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            + New
          </Link>
          <form action={signOut}>
            <button className="rounded-full border border-[color:var(--color-line)] px-4 py-2.5 text-sm text-[color:var(--color-fg-dim)] hover:text-white">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        {projects.length === 0 && (
          <p className="rounded-2xl glass p-8 text-center text-[color:var(--color-fg-dim)]">
            No projects yet. Create your first one.
          </p>
        )}
        {projects.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-surface)] p-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="truncate font-[family-name:var(--font-display)] text-lg font-semibold">
                  {p.title}
                </h2>
                <span
                  className={`rounded-full px-2 py-0.5 font-[family-name:var(--font-mono)] text-[0.6rem] uppercase ${
                    p.published ? "bg-white text-black" : "bg-[color:var(--color-surface-2)] text-[color:var(--color-fg-dim)]"
                  }`}
                >
                  {p.published ? "Live" : "Draft"}
                </span>
              </div>
              <p className="truncate text-sm text-[color:var(--color-fg-dim)]">{p.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <form action={togglePublished.bind(null, p.id, !p.published)}>
                <button className="rounded-full border border-[color:var(--color-line)] px-3 py-1.5 text-xs hover:bg-[color:var(--color-surface-2)]">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
              </form>
              <Link
                href={`/admin/projects/${p.id}`}
                className="rounded-full border border-[color:var(--color-line)] px-3 py-1.5 text-xs hover:bg-[color:var(--color-surface-2)]"
              >
                Edit
              </Link>
              <form action={deleteProject.bind(null, p.id)}>
                <button className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
