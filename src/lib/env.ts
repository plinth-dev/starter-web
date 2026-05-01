import "server-only";

import { createEnv } from "@plinth-dev/env";
import { z } from "zod";

/**
 * Validated server-side env. Reads `process.env` once at module load
 * and throws if any required variable is missing or the wrong shape.
 *
 * Add new keys to the schema; never read `process.env.X` directly from
 * application code — that bypasses the validation.
 */
export const env = createEnv({
  schema: z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    APP_ENV: z.enum(["dev", "staging", "production"]).default("dev"),
    SERVICE_NAME: z.string().min(1).default("starter-web"),
    SERVICE_VERSION: z.string().min(1).default("0.1.0-dev"),

    // The starter-api the web tier talks to.
    API_BASE_URL: z.url().default("http://localhost:8080"),

    // Cerbos PDP — same address as starter-api uses; the web tier may run
    // its own permissionMap calls or proxy through the API.
    CERBOS_ADDRESS: z.string().default("localhost:3593"),
    CERBOS_TLS: z
      .string()
      .transform((v) => v === "true" || v === "1")
      .default("false"),

    // OTel collector endpoint for the *server* runtime. The browser OTel
    // uses NEXT_PUBLIC_OTEL_EXPORTER_ENDPOINT below.
    OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
  }),
});
