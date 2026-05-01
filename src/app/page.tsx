import Link from "next/link";

import { getCurrentUser } from "@/lib/auth.js";

export default async function Home() {
  const user = await getCurrentUser();
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Plinth — Web starter</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          A clone-ready Next.js 16 module that wires every{" "}
          <code className="px-1 rounded" style={{ background: "var(--border)" }}>
            @plinth-dev
          </code>{" "}
          SDK package end-to-end.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">You are…</h2>
        {user ? (
          <p>
            Signed in as <strong>{user.id}</strong> with roles{" "}
            <code>{user.roles.join(", ") || "(none)"}</code>.
          </p>
        ) : (
          <p>
            Not signed in. The starter ships a dev-only cookie shim — set{" "}
            <code>plinth_dev_user=alice:editor</code> in your browser cookies and reload, or use the
            link below.
          </p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Try it</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>
            <Link href="/sign-in?as=alice:editor" className="underline">
              Sign in as alice (editor)
            </Link>
          </li>
          <li>
            <Link href="/sign-in?as=bob:viewer" className="underline">
              Sign in as bob (viewer)
            </Link>
          </li>
          <li>
            <Link href="/sign-out" className="underline">
              Sign out
            </Link>
          </li>
          <li>
            <Link href="/items" className="underline">
              Items list (table demo)
            </Link>
          </li>
          <li>
            <Link href="/items/new" className="underline">
              Create item (form demo)
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
