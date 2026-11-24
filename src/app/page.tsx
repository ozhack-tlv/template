import Link from "next/link";
import { Label, TopBar } from "@/components/Brand";
import { isDbConfigured } from "@/lib/db";

// דף הבית של הצוות. Claude יחליף אותו באפליקציה שלכם.
export default function Home() {
  return (
    <>
      <TopBar />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
        <section className="flex flex-col gap-4">
          <Label>HELLO, WORLD</Label>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            האתר של הצוות עלה לאוויר
            <span className="cursor ms-2" aria-hidden />
          </h1>
          <p className="text-lg text-muted">
            זה דף פתיחה זמני. ספרו ל-Claude איזו בעיה בבית הספר אתם פותרים,
            ותנו לו להחליף את הדף הזה באפליקציה שלכם.
          </p>
        </section>

        <section className="flex flex-col gap-4 border border-line p-6">
          <Label>SYSTEM CHECK</Label>
          <ul className="flex flex-col gap-2 font-mono text-sm">
            <li>
              <span dir="ltr" className="inline-block text-mint">[ OK ]</span> האתר עובד
            </li>
            <li>
              {isDbConfigured ? (
                <>
                  <span dir="ltr" className="inline-block text-mint">[ OK ]</span> מסד הנתונים מחובר
                </>
              ) : (
                <>
                  <span dir="ltr" className="inline-block text-ember">[FAIL]</span> מסד הנתונים לא מוגדר, חסר
                  הקובץ <bdi dir="ltr">.env.local</bdi>
                </>
              )}
            </li>
          </ul>
          <Link
            href="/guestbook"
            className="mt-2 w-fit border border-mint px-5 py-2 font-mono text-mint transition hover:bg-mint hover:text-ink"
          >
            לספר האורחים של ההאקתון ←
          </Link>
        </section>

        <p className="text-muted">
          <span dir="ltr" className="font-mono text-dim">
            {"//"}
          </span>{" "}
          הקוד שישנה את בית הספר.
        </p>
      </main>
    </>
  );
}
