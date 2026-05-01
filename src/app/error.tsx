"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to your error tracker; Sentry, Honeycomb, OpenTelemetry…
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>
        {error.message}
        {error.digest && (
          <span>
            {" "}
            (digest: <code>{error.digest}</code>)
          </span>
        )}
      </p>
      <button
        type="button"
        onClick={reset}
        className="px-3 py-1.5 text-sm border rounded"
        style={{ borderColor: "var(--border)" }}
      >
        Try again
      </button>
    </div>
  );
}
