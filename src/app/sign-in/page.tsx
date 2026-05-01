import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

/**
 * Dev-only sign-in. Reads `?as=<userid>:<roles>` from the URL, sets
 * the `plinth_dev_user` cookie, and bounces home.
 *
 * **CRITICAL: this route is gated to non-production builds.** A real
 * deployment must replace the auth shim wholesale (see "Auth: the
 * starter shim" in the README) and remove this directory entirely.
 * The hard 404 below is a defence-in-depth — even if a careless
 * deployment ships this file, the route returns 404 in production
 * rather than minting impersonation cookies for any caller.
 */
export default async function SignIn({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  const { as } = await searchParams;
  if (!as) {
    return (
      <div>
        <p>
          Pass <code>?as=&lt;userid&gt;:&lt;role1&gt;,&lt;role2&gt;</code>.
        </p>
      </div>
    );
  }
  const c = await cookies();
  c.set("plinth_dev_user", as, {
    httpOnly: true,
    sameSite: "lax",
    // NODE_ENV is narrowed to non-"production" by the notFound() above —
    // dev cookies don't need `secure` (and won't work over plain
    // localhost http if they did).
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/");
}
