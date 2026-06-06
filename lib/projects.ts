import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface ProjectImage {
  id: string;
  storage_path: string;
  public_url: string;
  alt_text: string | null;
  ordering: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string | null;
  tags: string[];
  cover_image_url: string | null;
  ordering: number;
  published: boolean;
  images?: ProjectImage[];
}

/** Sample content shown until Supabase is wired up, so the site never looks empty. */
export const sampleProjects: Project[] = [
  {
    id: "sample-1",
    slug: "aurora",
    title: "Aurora",
    description: "A browser-based realtime 3D editor with a custom WebGL renderer.",
    long_description:
      "Aurora is a collaborative 3D scene editor that runs entirely in the browser. It pairs a hand-written WebGL renderer with a CRDT sync layer so multiple people can sculpt the same scene at 120fps. This is placeholder content — replace it from the admin panel.",
    tags: ["WebGL", "Rust/WASM", "TypeScript"],
    cover_image_url: null,
    ordering: 0,
    published: true,
  },
  {
    id: "sample-2",
    slug: "pulse",
    title: "Pulse",
    description: "A flamegraph profiler that finds render bottlenecks in seconds.",
    long_description:
      "Pulse visualizes frame timing as an interactive flamegraph and surfaces the slowest paths automatically. Placeholder content — add your real projects in /admin.",
    tags: ["Go", "Canvas", "CLI"],
    cover_image_url: null,
    ordering: 1,
    published: true,
  },
  {
    id: "sample-3",
    slug: "driftfield",
    title: "Driftfield",
    description: "A generative art engine simulating fluid particle fields.",
    long_description:
      "Driftfield renders audio-reactive fluid particle fields with GLSL. Placeholder content — swap in your own work from the admin panel.",
    tags: ["GLSL", "Three.js", "Audio"],
    cover_image_url: null,
    ordering: 2,
    published: true,
  },
];

/** Published projects for the public site. Falls back to samples pre-Supabase. */
export async function getPublishedProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return sampleProjects;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*, images:project_images(*)")
      .eq("published", true)
      .order("ordering", { ascending: true });
    if (error || !data) return sampleProjects;
    return data as Project[];
  } catch {
    return sampleProjects;
  }
}
