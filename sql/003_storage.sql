-- Storage bucket for project images: owner writes, everyone reads.
-- Replace <ADMIN_UUID> with the owner's Supabase auth UUID.

insert into storage.buckets (id, name, public)
values ('portfolio-images', 'portfolio-images', true)
on conflict (id) do nothing;

drop policy if exists "public read portfolio images" on storage.objects;
create policy "public read portfolio images" on storage.objects
  for select to anon, authenticated using (bucket_id = 'portfolio-images');

drop policy if exists "owner uploads portfolio images" on storage.objects;
create policy "owner uploads portfolio images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'portfolio-images' and (select auth.uid()) = '<ADMIN_UUID>'::uuid);

drop policy if exists "owner deletes portfolio images" on storage.objects;
create policy "owner deletes portfolio images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'portfolio-images' and (select auth.uid()) = '<ADMIN_UUID>'::uuid);
