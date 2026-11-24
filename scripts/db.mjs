// npm run db: applies every SQL file in db/ that has not been applied yet, in order.
// Each file runs once, inside a transaction. Applied files are recorded in _migrations.
import { readdirSync, readFileSync } from "node:fs";
import pg from "pg";
import { requireDatabaseUrl } from "./env.mjs";

const client = new pg.Client({ connectionString: requireDatabaseUrl() });
await client.connect();

try {
  await client.query(`create table if not exists _migrations (
    name text primary key,
    applied_at timestamptz not null default now()
  )`);
  const { rows } = await client.query("select name from _migrations");
  const applied = new Set(rows.map((row) => row.name));

  const files = readdirSync("db").filter((f) => f.endsWith(".sql")).sort();
  let count = 0;
  for (const file of files) {
    if (applied.has(file)) continue;
    process.stdout.write(`▶ ${file} ... `);
    try {
      await client.query("begin");
      await client.query(readFileSync(`db/${file}`, "utf8"));
      await client.query("insert into _migrations (name) values ($1)", [file]);
      await client.query("commit");
      console.log("✅");
      count++;
    } catch (error) {
      await client.query("rollback");
      console.log("❌");
      console.error(`\nשגיאה בקובץ db/${file}:\n${error.message}`);
      console.error("שום שינוי מהקובץ הזה לא נשמר. תקנו אותו והריצו שוב.");
      process.exitCode = 1;
      break;
    }
  }
  if (!process.exitCode) {
    console.log(count ? `\nמסד הנתונים עודכן (קבצים שרצו: ${count}).` : "מסד הנתונים מעודכן, אין קבצים חדשים.");
  }
} finally {
  await client.end();
}
