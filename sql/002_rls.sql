-- Row Level Security. Public can read PUBLISHED projects; only the owner can write.
-- Replace <ADMIN_UUID> with the owner's Supabase auth UUID (from Authentication > Users),
-- the same value you put in NEXT_PUBLIC_ADMIN_USER_ID.

alter table public.projects enable row level security;
alter table public.project_images enable row level security;

-- Single source of truth for "is this the owner?"
create or replace function public.is_admin()
returns boolean language sql stable as $$
  select (select auth.uid()) = '<ADMIN_UUID>'::uuid;
$$;

-- ---- projects ----
drop policy if exists "public read published projects" on public.projects;
create policy "public read published projects" on public.projects
  for select to anon, authenticated using (published = true or public.is_admin());

drop policy if exists "owner writes projects" on public.projects;
create policy "owner writes projects" on public.projects
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---- project_images ----
drop policy if exists "public read images of published" on public.project_images;
create policy "public read images of published" on public.project_images
  for select to anon, authenticated using (
    public.is_admin() or exists (
      select 1 from public.projects p
      where p.id = project_images.project_id and p.published = true
    )
  );

drop policy if exists "owner writes images" on public.project_images;
create policy "owner writes images" on public.project_images
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
