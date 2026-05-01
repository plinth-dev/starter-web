"use client";

import type { ColumnDef } from "@plinth-dev/tables";
import Link from "next/link";

import type { Item } from "./types.js";

export const columns: ColumnDef<Item>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link href={`/items/${row.original.id}`} className="underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className="px-2 py-0.5 rounded text-xs"
        style={{
          background: row.original.status === "active" ? "#86efac33" : "#a8a29e33",
        }}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    id: "created_at",
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];
