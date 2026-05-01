import { Can, PermissionsProvider } from "@plinth-dev/authz-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { itemsApi } from "@/lib/api-client";
import { requireAuth } from "@/lib/auth";
import { itemPermissionMap } from "@/lib/authz";

import type { Item } from "../types";

export default async function ItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireAuth();
  const { id } = await params;

  // One round-trip to fetch the item; another (in parallel) for the
  // route's permission set.
  const [itemRes, permissions] = await Promise.all([
    itemsApi().get<Item>(`/items/${encodeURIComponent(id)}`),
    itemPermissionMap(user, id),
  ]);

  if (!itemRes.success || !itemRes.data) {
    if (itemRes.error?.code === "not_found") notFound();
    return (
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Failed to load item: {itemRes.error?.message ?? "unknown"}
      </p>
    );
  }
  const item = itemRes.data;

  return (
    <PermissionsProvider permissions={permissions}>
      <div className="space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">{item.name}</h1>
          <div className="flex gap-2">
            <Can action="update">
              <Link
                href={`/items/${item.id}/edit`}
                className="px-3 py-1.5 text-sm border rounded"
                style={{ borderColor: "var(--border)" }}
              >
                Edit
              </Link>
            </Can>
          </div>
        </header>

        <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt style={{ color: "var(--muted)" }}>ID</dt>
          <dd>
            <code>{item.id}</code>
          </dd>
          <dt style={{ color: "var(--muted)" }}>Status</dt>
          <dd>{item.status}</dd>
          <dt style={{ color: "var(--muted)" }}>Owner</dt>
          <dd>
            <code>{item.ownerId}</code>
          </dd>
          <dt style={{ color: "var(--muted)" }}>Created</dt>
          <dd>{new Date(item.createdAt).toLocaleString()}</dd>
          <dt style={{ color: "var(--muted)" }}>Updated</dt>
          <dd>{new Date(item.updatedAt).toLocaleString()}</dd>
        </dl>
      </div>
    </PermissionsProvider>
  );
}
