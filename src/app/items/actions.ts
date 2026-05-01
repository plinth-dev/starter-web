"use server";

import { createAction } from "@plinth-dev/forms/server";
import { z } from "zod";

import { itemsApi } from "@/lib/api-client.js";

import type { Item } from "./types.js";

const itemSchema = z.object({
  name: z.string().min(1).max(120),
  status: z.enum(["active", "archived"]),
});

/** Create a new item. Used by /items/new. */
export const createItem = createAction({
  schema: itemSchema,
  execute: async (input) => {
    const r = await itemsApi().post<Item>("/items", input);
    if (!r.success || !r.data) {
      throw new Error(r.error?.message ?? "create failed");
    }
    return r.data;
  },
  revalidate: "/items",
  successMessage: (data) => `Created ${data.name}.`,
  redirectTo: () => "/items",
});

/** Update an existing item. Used by /items/[id]/edit. */
export const updateItem = createAction({
  schema: itemSchema.extend({ id: z.string().min(1) }),
  execute: async ({ id, ...rest }) => {
    const r = await itemsApi().put<Item>(`/items/${encodeURIComponent(id)}`, rest);
    if (!r.success || !r.data) {
      throw new Error(r.error?.message ?? "update failed");
    }
    return r.data;
  },
  revalidate: "/items",
  successMessage: (data) => `Updated ${data.name}.`,
  redirectTo: (data) => `/items/${data.id}`,
});

/** Delete an item. Used by the detail page's Delete button. */
export const deleteItem = createAction({
  schema: z.object({ id: z.string().min(1) }),
  execute: async ({ id }) => {
    const r = await itemsApi().delete(`/items/${encodeURIComponent(id)}`);
    if (!r.success) {
      throw new Error(r.error?.message ?? "delete failed");
    }
    return { id };
  },
  revalidate: "/items",
  redirectTo: () => "/items",
});
