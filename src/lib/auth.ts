import "server-only";

import { cookies } from "next/headers";

/**
 * Resolved principal for the current request. Built once per request
 * and passed through `getCurrentUser()` (or `requireAuth()`) into
 * every Server Component / Server Action that needs it.
 */
export interface User {
  id: string;
  roles: readonly string[];
  /** Raw bearer token forwarded to the API. The API hands it to Cerbos
   * via `auxData.jwt`. */
  token: string;
}

/**
 * Starter-grade auth: reads the dev cookie `plinth_dev_user`, formatted
 * as `<userid>:<role1>,<role2>` to match starter-api's bearer-token
 * shape. **Replace before production** — see /docs/auth in the README.
 *
 * Returns null when no cookie is set; the caller decides whether
 * anonymous is allowed (`getCurrentUser`) or fatal (`requireAuth`).
 */
export async function getCurrentUser(): Promise<User | null> {
  const c = await cookies();
  const raw = c.get("plinth_dev_user")?.value;
  if (!raw) return null;
  const parts = raw.split(":");
  const id = parts[0];
  if (!id) return null;
  const roles = (parts[1] ?? "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);
  return { id, roles, token: raw };
}

/**
 * Like `getCurrentUser`, but throws when anonymous. Suitable for
 * Server Components that should never be reached without auth.
 *
 * Throws (rather than redirects) so the App Router's `error.tsx`
 * boundary surfaces the failure consistently. Wrap with `redirect()`
 * if you'd rather bounce to a login page.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthenticated");
  }
  return user;
}
