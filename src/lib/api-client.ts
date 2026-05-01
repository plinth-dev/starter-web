import "server-only";

import { api, register } from "@plinth-dev/api-client";

import { getCurrentUser } from "./auth";
import { env } from "./env";

/**
 * Register the "items-api" client at module load. Auth header is
 * resolved per-request from the current cookie — the API expects
 * `Bearer <userid>:<role1>,<role2>` in dev (matching its starter auth
 * shim).
 */
register("items-api", {
  baseUrl: env.API_BASE_URL,
  authHeader: async () => {
    const user = await getCurrentUser();
    if (!user) return null;
    return `Bearer ${user.token}`;
  },
});

/**
 * Single client used by Server Components and Server Actions to call
 * starter-api. Returned object has `get` / `post` / `put` / `delete`,
 * each returning `ApiResponse<T>` (never throws — failures land in
 * `.error`, RFC 7807 fields are exposed there).
 */
export function itemsApi() {
  return api("items-api");
}
