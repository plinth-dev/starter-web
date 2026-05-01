# Plinth — Web module starter

> **Status: not yet released — Phase C in progress.**
> The repo exists; the SDK packages it will import are still being designed in [`sdk-ts`](https://github.com/plinth-dev/sdk-ts) (Phase B). The "Quick start" and "What v0.1.0 ships with" sections below describe the **target shape**, not what you'd clone today. Track progress at [plinth.run](https://plinth.run) and on the [roadmap](https://github.com/plinth-dev/.github/blob/main/ROADMAP.md).

A clone-ready [Next.js 16](https://nextjs.org) module starter that imports `@plinth-dev/*` packages. Authentication, authorization, audit, observability, error boundaries, and security headers — all pre-wired.

## Quick start (target — Phase C)

```bash
git clone https://github.com/plinth-dev/starter-web my-module
cd my-module
pnpm install
pnpm dev          # http://localhost:3000
```

For everything-running-locally:

```bash
docker compose up --build      # Postgres, Cerbos, NATS, SigNoz, the module
```

## What v0.1.0 ships with (target)

- **Next.js 16** with App Router, Turbopack, standalone Docker output, React 19 server components.
- **Three-layer route group**: `app/(module)/layout.tsx` does `requireAuth` + batched `checkPermissions` + `<PermissionsProvider>` wrap.
- **Error boundaries**: `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`.
- **Security headers** in `next.config.ts`: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.
- **i18n** via `paraglide-js` (compile-time message keys).
- **Forms** via `@plinth-dev/forms` (server actions + Zod).
- **Tables** via `@plinth-dev/tables` (TanStack + nuqs URL state).
- **Tests**: Vitest unit tests, Playwright E2E, Storybook visual review.
- **Lint + format**: Biome 2.

## What v0.1.0 will NOT ship with

This is a starter, not a kitchen sink. Things you'll bring yourself:

- Domain logic (one canonical example resource — `Items` — will be included; delete it).
- Brand styling (Tailwind v4 + shadcn/ui primitives ship vendored; restyle freely).
- Specific integrations (no Slack, Stripe, etc).

## Customisation checklist

After cloning, search the repo for `// TODO: Customize for your module` and walk each one. Then update:

1. `package.json` — `name`, `description`, `repository`.
2. `next.config.ts` — production hostnames in `images.remotePatterns` and CSP.
3. `app/(module)/layout.tsx` — module name in metadata.
4. `cerbos/*.yaml` — replace `Item` with your resource kind.

## Related

- [`starter-api`](https://github.com/plinth-dev/starter-api) — the matching Go backend.
- [`sdk-ts`](https://github.com/plinth-dev/sdk-ts) — the SDK packages this starter imports.
- [`cli`](https://github.com/plinth-dev/cli) — `plinth new` automates the rename + register flow.

## License

MIT — see [LICENSE](./LICENSE).
