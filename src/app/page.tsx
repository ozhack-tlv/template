import Link from "next/link";
import { isSupabaseConfigured } from "@/lib/supabase";

// דף הבית של הצוות. Claude Code יחליף אותו באפליקציה שלכם.
export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="font-mono text-sm text-teal-500">
          <bdi dir="ltr">&lt;OZ/&gt; HACK</bdi>
        </p>
        <h1 className="text-4xl font-bold">האפליקציה שלנו עלתה לאוויר 🚀</h1>
        <p className="text-lg opacity-80">
          זה דף פתיחה זמני. פתחו את Claude Code, ספרו לו איזו בעיה בבית הספר אתם
          פותרים, ותנו לו להחליף את הדף הזה.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-xl border border-current/15 p-5">
        <h2 className="text-xl font-semibold">בדיקת מערכות</h2>
        <ul className="flex flex-col gap-1">
          <li>✅ האתר עובד</li>
          <li>
            {isSupabaseConfigured ? "✅" : "❌"} מסד הנתונים (Supabase){" "}
            {isSupabaseConfigured ? (
              "מוגדר"
            ) : (
              <>
                לא מוגדר. חסר הקובץ <bdi dir="ltr">.env.local</bdi>
              </>
            )}
          </li>
        </ul>
        <Link
          href="/guestbook"
          className="mt-2 w-fit rounded-lg bg-teal-500 px-4 py-2 font-medium text-black hover:bg-teal-400"
        >
          לבדיקת קריאה וכתיבה ←
        </Link>
      </section>
    </main>
  );
}
