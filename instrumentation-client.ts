// Browser OpenTelemetry init. Runs once on first client render.
//
// Reads `NEXT_PUBLIC_*` env vars at build time — `next build` inlines
// them into the client bundle. To disable export entirely, leave
// NEXT_PUBLIC_OTEL_EXPORTER_ENDPOINT empty.

import { initWebOtel } from "@plinth-dev/otel-web";

initWebOtel({
  serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME ?? "starter-web",
  serviceVersion: process.env.NEXT_PUBLIC_SERVICE_VERSION ?? "0.1.0-dev",
  moduleName: process.env.NEXT_PUBLIC_MODULE_NAME ?? "items",
  environment: process.env.NEXT_PUBLIC_APP_ENV ?? "dev",
  exporterEndpoint: process.env.NEXT_PUBLIC_OTEL_EXPORTER_ENDPOINT,
});
