import "server-only";

import { getClient } from "@plinth-dev/authz";
import type { User } from "./auth";
import { env } from "./env";

// First call reads CERBOS_ADDRESS / CERBOS_TLS / NODE_ENV; cached
// afterwards. authz.getClient() picks these up from process.env, so
// the env import here is just for the side-effect of validation +
// guaranteeing the values are set before this module loads.
void env;

/**
 * Convenience wrapper around `getClient().permissionMap(...)` for the
 * Item resource. Routes that render an Item view should call this in
 * their layout, then pass the result to `<PermissionsProvider>`.
 */
export async function itemPermissionMap(
  user: User,
  itemId: string,
  actions: readonly string[] = ["read", "update", "delete"],
) {
  return getClient().permissionMap(
    {
      id: user.id,
      roles: [...user.roles],
      auxData: { jwt: user.token },
    },
    { kind: "Item", id: itemId },
    [...actions],
  );
}
