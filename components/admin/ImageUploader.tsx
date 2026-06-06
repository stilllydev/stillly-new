"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { addProjectImage } from "@/app/admin/actions";

/** Uploads an image to Supabase Storage (browser client, RLS-guarded), then records it. */
export default function ImageUploader({ projectId }: { projectId: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [alt, setAlt] = useState("");

  const onFile = async (file: File) => {
    setBusy(true);
    setErr(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "png";
      const path = `${projectId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("portfolio-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("portfolio-images").getPublicUrl(path);
      await addProjectImage(projectId, data.publicUrl, path, alt);
      setAlt("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--color-line)] p-4">
      <label className="block text-sm font-medium">Add gallery image</label>
      <input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        placeholder="Alt text (optional)"
        className="mt-2 w-full rounded-lg border border-[color:var(--color-line)] bg-transparent px-3 py-2 text-sm outline-none focus:border-white"
      />
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
        className="mt-3 block w-full text-sm text-[color:var(--color-fg-dim)] file:mr-3 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-black hover:file:bg-zinc-200"
      />
      {busy && <p className="mt-2 text-xs text-[color:var(--color-fg-dim)]">Uploading…</p>}
      {err && <p className="mt-2 text-xs text-red-400">{err}</p>}
    </div>
  );
}
