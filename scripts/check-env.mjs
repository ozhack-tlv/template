// npm run check: verifies that the team's secret file is in place.
// (The Anthropic key is not in this project: it is set once in the Claude app.)
import { readEnvLocal, REQUIRED } from "./env.mjs";

const env = readEnvLocal();
let ok = true;

if (!env) {
  console.log("❌ חסר הקובץ .env.local בתיקייה הראשית. פנו למורה.");
  ok = false;
} else {
  for (const key of REQUIRED) {
    const good = Boolean(env[key]);
    console.log(`${good ? "✅" : "❌"} ${key}`);
    if (!good) ok = false;
  }
}

console.log(ok ? "\nהכל מוכן 🚀" : "\nחסרים פרטים. פנו למורה.");
process.exit(ok ? 0 : 1);
