---
name: start
description: Gets the team's project running from scratch - installs, checks the setup, prepares the database and opens the site preview. Use at the start of every work session.
disable-model-invocation: true
---

The students just opened the project. Get everything running without asking them to type any command. Speak Hebrew, short and friendly.

0. Make sure this computer has the tools (Node.js and Git). The students never install anything themselves; you do it with the setup script in this project:
   - Check with `node -v` and `git --version` (on macOS use `xcode-select -p` for Git, because `/usr/bin/git` exists even when Git is not installed). Node.js 20 or newer and Git are enough; if both are there, go to step 1.
   - Otherwise tell the students in one sentence that you're preparing the computer (a few minutes, nothing for them to do), then run the setup script for this operating system:
     - macOS: `bash scripts/setup/mac.sh`
     - Windows: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts/setup/windows.ps1`
     The script installs into the user's folder (`~/.ozhack/tools`), needs no admin password, and prints a final line `OZHACK_STATUS: ...`.
   - `OZHACK_STATUS: WAIT_FOR_GIT` (macOS): a system window opened asking to install "Command Line Tools". Tell them in Hebrew to click **Install** (התקנה) in that window and wait until it finishes (a few minutes), then run the script again.
   - `OZHACK_STATUS: RESTART`: the tools are installed but this window can't see them yet. Tell them in Hebrew, clearly: close the Claude app completely (Mac: Cmd+Q; Windows: right-click the Claude icon in the taskbar tray and Quit), open it again, open this same folder in the Code tab, and type `/start` again. Then stop.
   - `OZHACK_STATUS: READY`: continue.
   - If the script fails (no internet, a download blocked by the network, an antivirus), explain in one sentence and tell them to call the teacher. Do not try other installation methods.
1. If `node_modules` is missing, run `npm install`.
2. Run `npm run check`. If it fails, tell them in Hebrew which file is missing and to call the teacher. Do not try to create `.env.local` yourself.
3. Run `npm run db` to apply any new database files.
4. Connect the team's GitHub key, if the project has one: when a file named `.deploy-key` exists in the project root,
   - on macOS or Linux run `chmod 600 .deploy-key` (ssh refuses a key other users can read);
   - set git to use it for this repository only, with the absolute path of the project folder (forward slashes, also on Windows):
     `git config core.sshCommand "ssh -i '<absolute-project-path>/.deploy-key' -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"`
   Never print, read aloud or copy the key's contents.
5. Make sure git knows who is working: if `git config user.name` is empty in this repository, ask the students for the first names of the people working on this computer, then set them for this repository only: `git config user.name "<names, e.g. Noa & Itay>"` and `git config user.email "<team folder name, e.g. team07>@ozhack.dev"`. The students don't need GitHub accounts.
6. Run `git pull` to get the latest work from the rest of the team. If there is a conflict, explain it simply and resolve it with them.
7. Start the site preview (the "האתר שלנו" configuration in `.claude/launch.json`, which runs `npm run dev` on port 3000) so the site opens in the preview pane. If the preview can't start (for example it can't find `npm`), run `npm run dev` in the background yourself and open http://localhost:3000 in the app's browser pane instead.
8. Finish with a short message in Hebrew: everything is ready, the site is open in the preview, and they can now tell you in their own words what to build or change. Mention that when they want to publish they type `/ship`.
