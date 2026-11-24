// npm run deploy: publishes the site to Vercel and prints the live address.
// Works the same on Windows and Mac. The token is read from .env.local.
import { spawnSync } from "node:child_process";
import { readEnvLocal, REQUIRED } from "./env.mjs";

const env = readEnvLocal();
const missing = env ? REQUIRED.filter((key) => !env[key]) : REQUIRED;
if (missing.length) {
  console.error(`❌ חסר ב-.env.local: ${missing.join(", ")}. הריצו npm run check.`);
  process.exit(1);
}

const supabaseVars = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];
const args = ["vercel", "deploy", "--prod", "--yes", "--token", env.VERCEL_TOKEN];
for (const key of supabaseVars) {
  args.push("--build-env", `${key}=${env[key]}`, "--env", `${key}=${env[key]}`);
}

console.log("🚀 מעלה לאוויר... (בפעם הראשונה זה לוקח כמה דקות)");
const result = spawnSync("npx", args, {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
