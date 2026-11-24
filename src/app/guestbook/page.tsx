import { connection } from "next/server";
import { Suspense } from "react";
import { Label, TopBar, Wordmark } from "@/components/Brand";
import { isDbConfigured, sql } from "@/lib/db";
import { addEntry } from "./actions";

// ספר האורחים של ההאקתון: קורא וכותב לטבלה guestbook במסד הנתונים.
// הוא מוכיח שהחיבור עובד. אפשר למחוק אותו (ואת db/001_guestbook.sql) כשמתחילים לבנות.
//
// The pattern (Next.js Cache Components): the page shell is static, and the part
// that reads from the database is an async component inside <Suspense>,
// which calls connection() so it runs on every request with fresh data.

type Entry = { id: number; name: string; message: string; created_at: string };

const time = new Intl.DateTimeFormat("he-IL", {
  timeZone: "Asia/Jerusalem",
  hour: "2-digit",
  minute: "2-digit",
});

export default function Guestbook() {
  return (
    <>
      <TopBar path="/guestbook" />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <section className="flex flex-col gap-3">
          <Label>GUESTBOOK</Label>
          <h1 className="text-4xl font-bold">ספר האורחים של ההאקתון</h1>
          <p className="text-lg text-muted">
            השאירו שורה בלוג של <Wordmark />.
            כל שורה נשמרת במסד הנתונים של הצוות.
          </p>
        </section>

        <form action={addEntry} className="flex flex-col gap-3 border border-line p-6">
          <label className="flex items-center gap-3 border-b border-line pb-3">
            <span dir="ltr" className="font-mono text-mint">
              &gt;
            </span>
            <input
              name="name"
              required
              maxLength={80}
              placeholder="מי אתם?"
              className="w-full bg-transparent text-paper placeholder:text-dim focus:outline-none"
            />
          </label>
          <label className="flex items-start gap-3">
            <span dir="ltr" className="pt-0.5 font-mono text-mint">
              &gt;
            </span>
            <textarea
              name="message"
              required
              maxLength={500}
              rows={3}
              placeholder="מה בא לכם להגיד?"
              className="w-full resize-none bg-transparent text-paper placeholder:text-dim focus:outline-none"
            />
          </label>
          <button className="mt-2 w-fit border border-mint px-5 py-2 font-mono text-mint transition hover:bg-mint hover:text-ink">
            שליחה <span dir="ltr">⏎</span>
          </button>
        </form>

        <section className="flex flex-col gap-4">
          <Label>LOG</Label>
          <Suspense
            fallback={
              <p className="font-mono text-dim">
                טוען<span className="cursor ms-1" aria-hidden />
              </p>
            }
          >
            <Entries />
          </Suspense>
        </section>
      </main>
    </>
  );
}

async function Entries() {
  await connection();
  if (!isDbConfigured) {
    return <ErrorBox message="מסד הנתונים לא מוגדר: חסר DATABASE_URL בקובץ ההגדרות של הצוות" />;
  }
  const { entries, error } = await loadEntries();
  if (error) return <ErrorBox message={error} />;
  if (!entries.length) {
    return (
      <p className="font-mono text-dim">
        הלוג ריק. תהיו הראשונים<span className="cursor ms-1" aria-hidden />
      </p>
    );
  }
  return (
    <ol className="flex flex-col divide-y divide-line border-y border-line">
      {entries.map((entry) => (
        <li key={entry.id} className="flex gap-4 py-3">
          <span dir="ltr" className="shrink-0 font-mono text-sm leading-7 text-dim">
            [{time.format(new Date(entry.created_at))}]
          </span>
          <p className="leading-7">
            <span className="font-bold text-mint">{entry.name}</span>
            <span className="text-dim">: </span>
            {entry.message}
          </p>
        </li>
      ))}
    </ol>
  );
}

async function loadEntries(): Promise<{ entries: Entry[]; error: string | null }> {
  try {
    const rows = await sql`
      select id, name, message, created_at from guestbook
      order by created_at desc limit 30`;
    return { entries: rows as Entry[], error: null };
  } catch (e) {
    return { entries: [], error: e instanceof Error ? e.message : String(e) };
  }
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="border border-ember/50 p-4 font-mono text-sm">
      <p className="text-ember">
        <span dir="ltr">[ERROR]</span> <bdi>{message}</bdi>
      </p>
      <p className="mt-2 text-muted">
        אם החיבור מוגדר, בקשו מ-Claude להריץ את <bdi dir="ltr">npm run db</bdi>.
      </p>
    </div>
  );
}
