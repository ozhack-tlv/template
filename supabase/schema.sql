-- Example table for the /guestbook test page.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- When you build your real app, add new tables in new files under supabase/
-- and run them the same way.

create table if not exists public.guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);

alter table public.guestbook enable row level security;

-- Anyone with the site can read and add entries (no updates or deletes).
drop policy if exists "guestbook read" on public.guestbook;
create policy "guestbook read" on public.guestbook
  for select to anon, authenticated using (true);

drop policy if exists "guestbook insert" on public.guestbook;
create policy "guestbook insert" on public.guestbook
  for insert to anon, authenticated with check (true);
