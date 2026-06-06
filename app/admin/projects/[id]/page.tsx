import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { saveProject, deleteProjectImage } from "@/app/admin/actions";
import ImageUploader from "@/components/admin/ImageUploader";
import type { Project, ProjectImage } from "@/lib/projects";

export const dynamic = "force-dynamic";

const field =
  "mt-1 w-full rounded-lg border border-[color:var(--color-line)] bg-transparent px-3 py-2 outline-none focus:border-white";
const labelCls = "block text-sm font-medium text-[color:var(--color-fg-dim)]";

export default async function ProjectEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const { supabase } = await requireAdmin();

  let project: Project | null = null;
  let images: ProjectImage[] = [];

  if (!isNew) {
    const { data } = await supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("id", id)
      .single();
    if (!data) notFound();
    project = data as Project;
    images = (project.images ?? []).slice().sort((a, b) => a.ordering - b.ordering);
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8">
      <Link href="/admin" className="text-sm text-[color:var(--color-fg-dim)] hover:text-white">
        ← all projects
      </Link>
      <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">
        {isNew ? "New project" : `Edit: ${project?.title}`}
      </h1>

      <form action={saveProject.bind(null, isNew ? null : id)} className="mt-8 space-y-5">
        <div>
          <label className={labelCls}>Title *</label>
          <input name="title" defaultValue={project?.title} required className={field} />
        </div>
        <div>
          <label className={labelCls}>Slug (auto from title if blank)</label>
          <input name="slug" defaultValue={project?.slug} className={field} />
        </div>
        <div>
          <label className={labelCls}>Short description *</label>
          <input name="description" defaultValue={project?.description} required className={field} />
        </div>
        <div>
          <label className={labelCls}>Long description (shown in the modal)</label>
          <textarea
            name="long_description"
            defaultValue={project?.long_description ?? ""}
            rows={6}
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>Tags (comma-separated)</label>
          <input name="tags" defaultValue={project?.tags?.join(", ")} className={field} />
        </div>
        <div>
          <label className={labelCls}>Cover image URL</label>
          <input name="cover_image_url" defaultValue={project?.cover_image_url ?? ""} className={field} />
          <p className="mt-1 text-xs text-[color:var(--color-fg-faint)]">
            Tip: upload a gallery image below, then paste its URL here as the cover.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={project?.published} className="h-4 w-4" />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            Order
            <input
              type="number"
              name="ordering"
              defaultValue={project?.ordering ?? 0}
              className="w-20 rounded-lg border border-[color:var(--color-line)] bg-transparent px-2 py-1"
            />
          </label>
        </div>
        <button className="rounded-full bg-white px-7 py-3 font-medium text-black hover:bg-zinc-200">
          {isNew ? "Create project" : "Save changes"}
        </button>
      </form>

      {!isNew && project && (
        <section className="mt-12">
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-xl font-bold">Gallery</h2>
          <ImageUploader projectId={project.id} />
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img) => (
                <div key={img.id} className="group relative overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.public_url} alt={img.alt_text ?? ""} className="aspect-square w-full object-cover grayscale" />
                  <form
                    action={deleteProjectImage.bind(null, img.id, img.storage_path, project!.id)}
                    className="absolute right-2 top-2"
                  >
                    <button className="rounded-full bg-black/70 px-2 py-1 text-xs text-red-300 opacity-0 transition-opacity group-hover:opacity-100">
                      Delete
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
