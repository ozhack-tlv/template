import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { isDbConfigured, sql } from "@/lib/db";
import { addEntry } from "./actions";

// דף לדוגמה: קורא וכותב לטבלה guestbook במסד הנתונים.
// הוא מוכיח שהחיבור עובד. אפשר למחוק אותו (ואת db/001_guestbook.sql) כשמתחילים לבנות.
//
// The pattern (Next.js Cache Components): the page shell is static, and the part
// that reads from the database is an async component inside <Suspense>,
// which calls connection() so it runs on every request with fresh data.

type Entry = { id: number; name: string; message: string };

async function Entries() {
  await connection();
  if (!isDbConfigured) {
    return <ErrorBox message="מסד הנתונים לא מוגדר: חסר DATABASE_URL בקובץ ההגדרות של הצוות" />;
  }
  const { entries, error } = await loadEntries();
  if (error) return <ErrorBox message={error} />;
  if (!entries.length) return <p className="opacity-70">עוד אין הודעות. תהיו הראשונים.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-lg border border-current/15 p-3">
          <p className="font-semibold">{entry.name}</p>
          <p>{entry.message}</p>
        </li>
      ))}
    </ul>
  );
}

async function loadEntries(): Promise<{ entries: Entry[]; error: string | null }> {
  try {
    const rows = await sql`
      select id, name, message from guestbook order by created_at desc limit 20`;
    return { entries: rows as Entry[], error: null };
  } catch (e) {
    return { entries: [], error: e instanceof Error ? e.message : String(e) };
  }
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p className="rounded-lg bg-red-500/15 p-3 text-red-500">
      שגיאה: <bdi>{message}</bdi>
      <br />
      <span className="text-sm opacity-80">
        אם החיבור מוגדר, בדקו שהטבלה נוצרה: מריצים <bdi dir="ltr">npm run db</bdi>
      </span>
    </p>
  );
}

export default function Guestbook() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/" className="w-fit opacity-70 hover:opacity-100">
        → חזרה
      </Link>
      <h1 className="text-3xl font-bold">ספר אורחים (בדיקת מסד נתונים)</h1>

      <form action={addEntry} className="flex flex-col gap-3">
        <input
          name="name"
          required
          maxLength={80}
          placeholder="שם"
          className="rounded-lg border border-current/20 bg-transparent px-3 py-2"
        />
        <textarea
          name="message"
          required
          maxLength={500}
          rows={3}
          placeholder="הודעה"
          className="rounded-lg border border-current/20 bg-transparent px-3 py-2"
        />
        <button className="w-fit rounded-lg bg-teal-500 px-4 py-2 font-medium text-black hover:bg-teal-400">
          שליחה
        </button>
      </form>

      <Suspense fallback={<p className="opacity-70">טוען...</p>}>
        <Entries />
      </Suspense>
    </main>
  );
}
