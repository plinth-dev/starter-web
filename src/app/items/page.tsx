import { ServerTable } from "@plinth-dev/tables";
import { parseTableSearchParams } from "@plinth-dev/tables/server";
import Link from "next/link";

import { itemsApi } from "@/lib/api-client";
import { requireAuth } from "@/lib/auth";

import { columns } from "./columns";
import type { Item } from "./types";

interface PaginatedItems {
  items: Item[];
  meta: {
    page: number;
    pageSize: number;
    totalCount?: number;
    totalPages?: number;
    nextCursor?: string;
    hasNext: boolean;
  };
}

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAuth();
  const sp = await searchParams;
  const params = parseTableSearchParams(sp, ["name", "status", "created_at", "updated_at"]);

  // Build the API query string from the parsed params + filter values.
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("pageSize", String(params.pageSize));
  if (params.sortBy) qs.set("sortBy", params.sortBy);
  if (params.sortOrder) qs.set("sortOrder", params.sortOrder);
  if (params.search) qs.set("q", params.search);
  for (const [key, value] of Object.entries(params.filters)) {
    qs.set(key, Array.isArray(value) ? value.join(",") : value);
  }

  const r = await itemsApi().get<PaginatedItems>(`/items?${qs.toString()}`);
  if (!r.success || !r.data) {
    return (
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold">Items</h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Failed to load items: {r.error?.message ?? "unknown error"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Items</h1>
        <Link
          href="/items/new"
          className="px-3 py-1.5 text-sm border rounded"
          style={{ borderColor: "var(--border)" }}
        >
          New item
        </Link>
      </header>

      <ServerTable
        columns={columns}
        data={r.data.items}
        pagination={r.data.meta}
        searchPlaceholder="Search items..."
        filters={[
          {
            type: "select",
            key: "status",
            label: "Status",
            options: [
              { value: "active", label: "Active" },
              { value: "archived", label: "Archived" },
            ],
          },
        ]}
        emptyState={
          <span style={{ color: "var(--muted)" }}>
            No items yet —{" "}
            <Link href="/items/new" className="underline">
              create one
            </Link>
            .
          </span>
        }
      />
    </div>
  );
}
