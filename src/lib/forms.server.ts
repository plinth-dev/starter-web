import "server-only";

import {
  setAuthContextFunc,
  setRedirectFunc,
  setRevalidateFunc,
  setRevalidateTagFunc,
  setTraceIdFunc,
} from "@plinth-dev/forms/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "./auth";

/**
 * Wire `@plinth-dev/forms` to Next.js's primitives. Imported once from
 * the root layout (or any Server Component) so adapters are registered
 * before the first action runs.
 *
 * Defaults inside the package are no-ops — these wirings unlock the
 * Next.js-specific behaviours.
 */
setAuthContextFunc(async () => {
  const u = await getCurrentUser();
  return u ? { id: u.id, roles: [...u.roles] } : null;
});

setTraceIdFunc(() => {
  // Replace with your OTel-aware trace ID extractor when running with
  // the OpenTelemetry SDK on the server (e.g.,
  // `import { trace } from "@opentelemetry/api";` then
  // `trace.getActiveSpan()?.spanContext().traceId ?? ""`). Empty string
  // means "no trace ID known" — actions still work, just without a
  // trace correlation in audit.
  return "";
});

setRevalidateFunc(revalidatePath);
// Next.js 16's revalidateTag requires a cache lifetime profile as a
// second argument; pass "default" through the wrapper so the forms
// adapter contract `(tag: string) => void` still holds.
setRevalidateTagFunc((tag) => {
  revalidateTag(tag, "default");
});
setRedirectFunc(redirect);
