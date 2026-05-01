import { FormField, FormWrapper } from "@plinth-dev/forms/client";

import { requireAuth } from "@/lib/auth";

import { createItem } from "../actions";

export default async function NewItem() {
  await requireAuth();
  return (
    <div className="space-y-4 max-w-md">
      <h1 className="text-2xl font-semibold">New item</h1>
      <FormWrapper action={createItem} className="space-y-3">
        <FormField type="text" name="name" label="Name" required />
        <FormField
          type="select"
          name="status"
          label="Status"
          required
          defaultValue="active"
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
          Create
        </button>
      </FormWrapper>
    </div>
  );
}
