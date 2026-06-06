"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  return {
    title,
    slug: (String(formData.get("slug") ?? "").trim() || slugify(title)),
    description: String(formData.get("description") ?? "").trim(),
    long_description: String(formData.get("long_description") ?? "").trim() || null,
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    cover_image_url: String(formData.get("cover_image_url") ?? "").trim() || null,
    ordering: Number(formData.get("ordering") ?? 0) || 0,
    published: formData.get("published") === "on",
  };
}

export async function saveProject(id: string | null, formData: FormData) {
  const { supabase } = await requireAdmin();
  const values = parseForm(formData);
  if (!values.title || !values.description) {
    throw new Error("Title and description are required.");
  }

  if (id) {
    const { error } = await supabase.from("projects").update(values).eq("id", id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("projects").insert(values);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/admin");
  revalidatePath("/portfolio");
  redirect("/admin");
}

export async function deleteProject(id: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/portfolio");
}

export async function togglePublished(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("projects").update({ published }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin");
  revalidatePath("/portfolio");
}

export async function addProjectImage(projectId: string, publicUrl: string, storagePath: string, alt: string) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("project_images").insert({
    project_id: projectId,
    public_url: publicUrl,
    storage_path: storagePath,
    alt_text: alt || null,
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/portfolio");
}

export async function deleteProjectImage(imageId: string, storagePath: string, projectId: string) {
  const { supabase } = await requireAdmin();
  await supabase.storage.from("portfolio-images").remove([storagePath]);
  const { error } = await supabase.from("project_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/projects/${projectId}`);
  revalidatePath("/portfolio");
}

export async function signOut() {
  const { supabase } = await requireAdmin();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
