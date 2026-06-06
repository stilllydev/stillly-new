-- Projects + gallery images for the portfolio.
-- Run in the Supabase SQL editor.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  long_description text,
  tags text[] not null default '{}',
  cover_image_url text,
  ordering int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  storage_path text not null,
  public_url text not null,
  alt_text text,
  ordering int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists projects_published_ordering_idx on public.projects (published, ordering);
create index if not exists project_images_project_idx on public.project_images (project_id);

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects
  for each row execute function public.touch_updated_at();
