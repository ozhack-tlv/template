---
name: ship
description: Saves the team's work and publishes it to the live site - builds, fixes errors, commits and pushes to GitHub, which deploys automatically.
disable-model-invocation: true
---

The students want to save their work and publish it to the live site. Do all of it yourself and explain in Hebrew, briefly.

1. Run `npm run build`. If it fails, fix the errors, explain in one sentence what was wrong, and run the build again until it passes. Do not publish a broken build.
2. If there are new files in `db/` that were not applied yet, run `npm run db`.
3. Run `git status` and `git diff --stat` to see what changed. Summarize the changes for the students in 2-3 short Hebrew bullet points.
4. Commit with a short English message that describes the change, for example `git add -A && git commit -m "Add request form"`. Never commit `.env.local`.
5. Run `git pull` first, then `git push origin main`.
   - The project pushes with the team's key (set up by `/start`). If the push fails with `Permission denied (publickey)` or asks for a password, run the `/start` key step again; if it still fails, tell the students in Hebrew to call the teacher.
   - If it is rejected because of new work from teammates, run `git pull`, resolve any conflict with them, build again, and push.
6. Tell them in Hebrew: the work is saved on GitHub, the live site will update in about a minute, and they can see it is done when the latest commit on the team's GitHub page shows a green check mark.
