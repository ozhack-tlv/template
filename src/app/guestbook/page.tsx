"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

// דף לדוגמה: קורא וכותב לטבלה guestbook ב-Supabase.
// הוא מוכיח שהחיבור למסד הנתונים עובד. אפשר למחוק אותו כשמתחילים לבנות.
type Entry = { id: number; name: string; message: string; created_at: string };

export default function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    if (!isSupabaseConfigured) {
      setError("מסד הנתונים לא מוגדר. חסר קובץ ההגדרות של הצוות (env.local)");
      return;
    }
    const { data, error } = await supabase
      .from("guestbook")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) setError(error.message);
    else setEntries(data ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSaving(true);
    const { error } = await supabase
      .from("guestbook")
      .insert({ name: name.trim(), message: message.trim() });
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setMessage("");
    setError(null);
    load();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-6 py-16">
      <Link href="/" className="w-fit opacity-70 hover:opacity-100">
        → חזרה
      </Link>
      <h1 className="text-3xl font-bold">ספר אורחים (בדיקת מסד נתונים)</h1>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="שם"
          className="rounded-lg border border-current/20 bg-transparent px-3 py-2"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="הודעה"
          rows={3}
          className="rounded-lg border border-current/20 bg-transparent px-3 py-2"
        />
        <button
          disabled={saving}
          className="w-fit rounded-lg bg-teal-500 px-4 py-2 font-medium text-black hover:bg-teal-400 disabled:opacity-50"
        >
          {saving ? "שומר..." : "שליחה"}
        </button>
      </form>

      {error && (
        <p className="rounded-lg bg-red-500/15 p-3 text-red-500">
          שגיאה: <bdi>{error}</bdi>
          <br />
          <span className="text-sm opacity-80">
            אם הקובץ קיים, בדקו שהטבלה נוצרה: מריצים את{" "}
            <bdi dir="ltr">supabase/schema.sql</bdi> ב-SQL Editor של Supabase.
          </span>
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-lg border border-current/15 p-3">
            <p className="font-semibold">{entry.name}</p>
            <p>{entry.message}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
