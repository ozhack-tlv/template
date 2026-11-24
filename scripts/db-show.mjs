// npm run db:show            → lists the tables and how many rows each has
// npm run db:show -- guestbook → shows the latest 20 rows of a table
import pg from "pg";
import { requireDatabaseUrl } from "./env.mjs";

const client = new pg.Client({ connectionString: requireDatabaseUrl() });
await client.connect();

try {
  const table = process.argv[2];
  if (!table) {
    const { rows } = await client.query(`
      select table_name from information_schema.tables
      where table_schema = 'public' and table_name <> '_migrations'
      order by table_name`);
    if (!rows.length) console.log("אין עדיין טבלאות. הריצו npm run db.");
    const summary = [];
    for (const { table_name } of rows) {
      const ident = client.escapeIdentifier(table_name);
      const { rows: count } = await client.query(`select count(*)::int as n from ${ident}`);
      summary.push({ table: table_name, rows: count[0].n });
    }
    if (summary.length) console.table(summary);
  } else {
    const ident = client.escapeIdentifier(table);
    const { rows } = await client.query(`select * from ${ident} limit 20`);
    console.table(rows);
  }
} catch (error) {
  console.error(`❌ ${error.message}`);
  process.exitCode = 1;
} finally {
  await client.end();
}
