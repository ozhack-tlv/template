---
name: start
description: Gets the team's project running from scratch - installs, checks the setup, prepares the database and opens the site preview. Use at the start of every work session.
disable-model-invocation: true
---

The students just opened the project. Get everything running without asking them to type any command. Speak Hebrew, short and friendly.

1. If `node_modules` is missing, run `npm install`. If it fails because Node.js or npm is not installed, stop and tell them in Hebrew to call the teacher (Node.js is missing on this computer).
2. Run `npm run check`. If it fails, tell them in Hebrew which file is missing and to call the teacher. Do not try to create `.env.local` yourself.
3. Run `npm run db` to apply any new database files.
4. Connect the team's GitHub key, if the project has one: when a file named `.deploy-key` exists in the project root,
   - on macOS or Linux run `chmod 600 .deploy-key` (ssh refuses a key other users can read);
   - set git to use it for this repository only, with the absolute path of the project folder (forward slashes, also on Windows):
     `git config core.sshCommand "ssh -i '<absolute-project-path>/.deploy-key' -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"`
   Never print, read aloud or copy the key's contents.
5. Make sure git knows who is working: if `git config user.name` is empty in this repository, ask the students for the first names of the people working on this computer, then set them for this repository only: `git config user.name "<names, e.g. Noa & Itay>"` and `git config user.email "<team folder name, e.g. team07>@ozhack.dev"`. The students don't need GitHub accounts.
6. Run `git pull` to get the latest work from the rest of the team. If there is a conflict, explain it simply and resolve it with them.
7. Start the site preview (the "האתר שלנו" configuration in `.claude/launch.json`, which runs `npm run dev` on port 3000) so the site opens in the preview pane.
8. Finish with a short message in Hebrew: everything is ready, the site is open in the preview, and they can now tell you in their own words what to build or change. Mention that when they want to publish they type `/ship`.
