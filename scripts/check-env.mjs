// npm run check: verifies that the team's secret files are in place.
import { existsSync, readFileSync } from "node:fs";
import { readEnvLocal, REQUIRED } from "./env.mjs";

let ok = true;
const env = readEnvLocal();

if (!env) {
  console.log("❌ חסר הקובץ .env.local. קבלו אותו מהמורה והעתיקו לתיקייה הראשית.");
  ok = false;
} else {
  for (const key of REQUIRED) {
    const good = Boolean(env[key]);
    console.log(`${good ? "✅" : "❌"} ${key}`);
    if (!good) ok = false;
  }
}

const claudeSettings = ".claude/settings.local.json";
let hasKey = false;
if (existsSync(claudeSettings)) {
  try {
    hasKey = Boolean(
      JSON.parse(readFileSync(claudeSettings, "utf8"))?.env?.ANTHROPIC_API_KEY,
    );
  } catch {
    hasKey = false;
  }
}
console.log(`${hasKey ? "✅" : "❌"} מפתח Claude Code (${claudeSettings})`);
if (!hasKey) ok = false;

console.log(ok ? "\nהכל מוכן 🚀" : "\nחסרים קבצים. פנו למורה.");
process.exit(ok ? 0 : 1);
