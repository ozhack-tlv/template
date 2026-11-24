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
- Database: Postgres on Neon. Use the `sql` tagged template from `src/lib/db.ts` (Neon serverless driver). Do not create another client or add an ORM.
- The database is reached only from the server: Server Components, Server Actions (`"use server"`) and Route Handlers. Never import `src/lib/db.ts` into a Client Component (`"use client"`); it is marked `server-only` and the build will fail.
- Always pass values through `${...}` in the `sql` template (they become safe parameters). Never build SQL by string concatenation.
- Cache Components is enabled (`cacheComponents: true`), so `export const dynamic` is not allowed. To read fresh data, put the reading code in an async component that calls `await connection()` (from `next/server`) and render it inside `<Suspense>`. After a write in a Server Action, call `revalidatePath(...)`.
- See `src/app/guestbook` for the reference pattern (read in a Server Component, write in a Server Action).
- No login system unless the team explicitly asks for one.

## Database changes
- Every new table or change is a new SQL file in `db/` with the next number, for example `db/002_requests.sql`. Never edit a file that was already applied; add a new one instead.
- Apply it yourself with `npm run db` (runs only files that were not applied yet, each in a transaction). Inspect data with `npm run db:show` or `npm run db:show -- <table>`.
- `db/001_guestbook.sql` and `src/app/guestbook` are a connection test. They can be deleted once the real app works (to remove the table, add a new file with `drop table if exists guestbook;`).

## Secrets: never break these rules
- Never read, print, copy or commit `.env.local` or `.claude/settings.local.json`.
- Never write a key, token, password or connection string into source code. Use `process.env`.
- `DATABASE_URL` must never reach the browser: never prefix it with `NEXT_PUBLIC_`.

## Commands
- `npm run dev` – run locally at http://localhost:3000
- `npm run check` – verify the secret files are in place
- `npm run db` – apply new SQL files from `db/`
- `npm run db:show` – list tables and row counts (`npm run db:show -- <table>` for rows)
- Commit and push often, with short English messages: `git add -A && git commit -m "..." && git push`.

## Deployment
- Every `git push` to `main` deploys the live site automatically (Vercel, connected by the teacher). There is no deploy command and no Vercel token in this project.
- Before pushing, run `npm run build` and fix every error: a broken build means the live site is not updated.
- The live site's database is the same Neon database as in `.env.local`. Apply new `db/` files with `npm run db` before pushing code that depends on them.
- If the students ask whether the site is live, tell them to check the green check mark next to the latest commit on the team's GitHub page.
- Never use `git push --force`, never rewrite history, never delete branches.
