import { FormField, FormWrapper } from "@plinth-dev/forms/client";
import { notFound } from "next/navigation";

import { itemsApi } from "@/lib/api-client.js";
import { requireAuth } from "@/lib/auth.js";

import { updateItem } from "../../actions.js";
import type { Item } from "../../types.js";

export default async function EditItem({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth();
  const { id } = await params;

  const r = await itemsApi().get<Item>(`/items/${encodeURIComponent(id)}`);
  if (!r.success || !r.data) {
    if (r.error?.code === "not_found") notFound();
    return (
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        Failed to load item: {r.error?.message ?? "unknown"}
      </p>
    );
  }
  const item = r.data;

  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-semibold">Edit {item.name}</h1>
      <FormWrapper action={updateItem} className="space-y-3">
        <FormField type="hidden" name="id" defaultValue={item.id} />
        <FormField type="text" name="name" label="Name" required defaultValue={item.name} />
        <FormField
          type="select"
          name="status"
          label="Status"
          required
          defaultValue={item.status}
          options={[
            { value: "active", label: "Active" },
            { value: "archived", label: "Archived" },
          ]}
        />
        <button
          type="submit"
          className="px-3 py-1.5 text-sm border rounded"
          style={{ borderColor: "var(--border)" }}
        >
          Save
        </button>
      </FormWrapper>
    </div>
  );
}
