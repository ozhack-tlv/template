@AGENTS.md

# <OZ/> HACK – team project

You are helping a team of 11th-grade Computer Science students (Amos Oz high school, Tel Aviv) during a one-day hackathon. They are building a small web app that solves a real problem at their school. They know basic programming (C#/Java style) but are new to web development.

## How to work with the students
- Speak Hebrew. Keep code, identifiers, file names and commit messages in English.
- Before a big change, say in 2–3 sentences what you are about to do, then do it.
- After each change, explain briefly what changed and how to see it (which page, what to click).
- Work in small steps that can be seen in the browser. Prefer a working simple version over a complete complex one: this is an MVP built in one day.
- When something fails, read the error, fix the cause, and explain the cause in one sentence.
- If the request is vague, ask one short question instead of guessing.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS, in `src/app`.
- The UI is Hebrew and right-to-left (`dir="rtl"` is already set in `src/app/layout.tsx`). Use logical Tailwind classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) instead of left/right.
- Database: Supabase, through the client in `src/lib/supabase.ts`. Do not create another client.
- No login system unless the team explicitly asks for one.

## Database changes
- Write every new table or change as SQL in a new file under `supabase/` (for example `supabase/002_requests.sql`), with row level security enabled and explicit policies.
- You cannot run SQL against the database. Tell the students to open Supabase → SQL Editor, paste the file and press Run, and wait for them to confirm.
- `supabase/schema.sql` and `src/app/guestbook` are a connection test. They can be deleted once the real app works.

## Secrets: never break these rules
- Never read, print, copy or commit `.env.local` or `.claude/settings.local.json`.
- Never write a key, token or password into source code. Use `process.env`.
- Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` may reach the browser.

## Commands
- `npm run dev` – run locally at http://localhost:3000
- `npm run check` – verify the secret files are in place
- `npm run deploy` – publish to the live site (Vercel). Run `npm run build` first; fix any error before deploying.
- Commit and push often, with short English messages: `git add -A && git commit -m "..." && git push`.
- Never use `git push --force`, never rewrite history, never delete branches.
