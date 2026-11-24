import Link from "next/link";

// Shared <OZ/> HACK look: the top bar with the logo and the terminal prompt.
// Claude can replace this with the team's own branding.

// The wordmark inline in a sentence (keeps "<OZ/> HACK" in order inside Hebrew text)
export function Wordmark() {
  return (
    <bdi dir="ltr" className="font-mono font-bold text-paper">
      <span className="text-mint">&lt;</span>OZ<span className="text-mint">/&gt;</span> HACK
    </bdi>
  );
}

export function Logo() {
  return (
    <Link href="/" dir="ltr" className="font-mono text-xl font-bold tracking-tight">
      <span className="text-mint">&lt;</span>OZ<span className="text-mint">/&gt;</span>{" "}
      HACK
    </Link>
  );
}

export function TopBar({ path = "" }: { path?: string }) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
      <Logo />
      <p dir="ltr" className="hidden font-mono text-sm text-dim sm:block">
        ~/amos-oz/cs{path} $ npm run dev
      </p>
    </header>
  );
}

// A "// comment"-style section label, like on ozhack.dev
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-sm tracking-[0.25em] text-mint">
      <span dir="ltr" className="inline-block">
        {"// "}
        {children}
      </span>
    </p>
  );
}
