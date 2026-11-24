-- Example table for the /guestbook test page.
-- Applied by: npm run db
-- New tables go in new files with the next number: db/002_....sql

create table if not exists guestbook (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 80),
  message text not null check (char_length(message) between 1 and 500),
  created_at timestamptz not null default now()
);
