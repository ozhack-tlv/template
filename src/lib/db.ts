import "server-only";
import { neon } from "@neondatabase/serverless";

// The connection to the team's database (Neon Postgres).
// Runs only on the server: the browser never sees DATABASE_URL.
// Usage:  const rows = await sql`select * from guestbook where id = ${id}`;
// Values inside ${...} are sent safely as parameters (no SQL injection).

const url = process.env.DATABASE_URL;

export const isDbConfigured = Boolean(url);

export const sql = neon(url ?? "postgresql://missing:missing@missing.invalid/missing");
