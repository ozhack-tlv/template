// Reads .env.local into an object (no external packages needed).
import { existsSync, readFileSync } from "node:fs";

export function readEnvLocal() {
  if (!existsSync(".env.local")) return null;
  const env = {};
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

export const REQUIRED = ["DATABASE_URL"];

// Returns DATABASE_URL or exits with a clear Hebrew message.
export function requireDatabaseUrl() {
  const url = process.env.DATABASE_URL || readEnvLocal()?.DATABASE_URL;
  if (!url) {
    console.error("❌ חסר DATABASE_URL בקובץ .env.local. הריצו npm run check.");
    process.exit(1);
  }
  return url;
}
