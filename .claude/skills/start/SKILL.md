---
name: start
description: Gets the team's project running from scratch - installs, checks the setup, prepares the database and opens the site preview. Use at the start of every work session.
disable-model-invocation: true
---

The students just opened the project. Get everything running without asking them to type any command. Speak Hebrew, short and friendly.

1. If `node_modules` is missing, run `npm install`. If it fails because Node.js or npm is not installed, stop and tell them in Hebrew to call the teacher (Node.js is missing on this computer).
2. Run `npm run check`. If it fails, tell them in Hebrew which file is missing and to call the teacher. Do not try to create `.env.local` yourself.
3. Run `npm run db` to apply any new database files.
4. Make sure git knows who is working: if `git config user.name` is empty in this repository, ask the students for the names of the people in the team and their GitHub email, then set them for this repository only with `git config user.name "..."` and `git config user.email "..."`.
5. Run `git pull` to get the latest work from the rest of the team. If there is a conflict, explain it simply and resolve it with them.
6. Start the site preview (the "האתר שלנו" configuration in `.claude/launch.json`, which runs `npm run dev` on port 3000) so the site opens in the preview pane.
7. Finish with a short message in Hebrew: everything is ready, the site is open in the preview, and they can now tell you in their own words what to build or change. Mention that when they want to publish they type `/ship`.
