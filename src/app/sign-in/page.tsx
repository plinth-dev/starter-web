import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Dev-only sign-in. Reads `?as=<userid>:<roles>` from the URL, sets
 * the `plinth_dev_user` cookie, and bounces home. **Replace with real
 * auth before production** — see /docs/auth in the README.
 */
export default async function SignIn({ searchParams }: { searchParams: Promise<{ as?: string }> }) {
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
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  redirect("/");
}
