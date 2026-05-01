# Plinth — Web module starter

A clone-ready [Next.js 16](https://nextjs.org) module that pre-wires every `@plinth-dev/*` package into a working app. One sample resource (`items`) shipped end-to-end so the integration of every SDK is visible.

Pre-wired:
- **Validated env** via `@plinth-dev/env` (Zod, fail-fast at module load).
- **Server-side API client** via `@plinth-dev/api-client` (server-only fetch wrapper, never throws).
- **Authorization** via `@plinth-dev/authz` (server) + `@plinth-dev/authz-react` (client) — batched `permissionMap` once per route, `<Can>` gates on the client.
- **Forms** via `@plinth-dev/forms` (`<FormWrapper>` + `<FormField>` + `useFormContext`, with Next.js adapter wiring).
- **Tables** via `@plinth-dev/tables` (`<ServerTable>` reading URL state via `next/navigation`).
- **Browser OTel** via `@plinth-dev/otel-web` (fetch + document-load auto-instrumented; trace propagation to the API).
- **Security headers** in `next.config.ts` (CSP, HSTS, X-Frame-Options, etc.).
- **Error boundaries** at the App Router level.

See [plinth.run](https://plinth.run) for the SDK design rationale.

## Quick start

Requirements: Node 20+, pnpm 9+, [`starter-api`](https://github.com/plinth-dev/starter-api) running locally on `:8080`.

```bash
# Clone and rename for your module.
git clone https://github.com/plinth-dev/starter-web my-module
cd my-module
pnpm install

# Copy env template and edit if needed.
cp .env.example .env.local

# Start the dev server.
pnpm dev          # http://localhost:3000
```

Open <http://localhost:3000>, hit "Sign in as alice" to set the dev cookie, then walk through the items list, create / edit forms, and detail page.

## Layout

```
.
├── instrumentation-client.ts    # @plinth-dev/otel-web init (browser)
├── next.config.ts               # standalone output + security headers
├── postcss.config.mjs           # Tailwind v4
├── biome.json                   # lint + format
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx           # imports lib/forms.server.ts to wire adapters
    │   ├── globals.css          # Tailwind + plinth-table / plinth-form styles
    │   ├── page.tsx             # home — sign-in shortcuts
    │   ├── error.tsx
    │   ├── not-found.tsx
    │   ├── sign-in/page.tsx     # dev-only cookie-set
    │   ├── sign-out/page.tsx
    │   └── items/
    │       ├── page.tsx         # ServerTable + parseTableSearchParams
    │       ├── new/page.tsx     # FormWrapper + FormField (create)
    │       ├── [id]/
    │       │   ├── page.tsx     # PermissionsProvider + Can
    │       │   └── edit/page.tsx
    │       ├── actions.ts       # createAction (createItem, updateItem, deleteItem)
    │       ├── columns.tsx
    │       └── types.ts
    └── lib/
        ├── env.ts               # @plinth-dev/env — validated server env
        ├── auth.ts              # dev cookie reader (replace before prod)
        ├── api-client.ts        # @plinth-dev/api-client — registered + auth header
        ├── authz.ts              # itemPermissionMap helper
        └── forms.server.ts      # wires forms adapters to next/cache + next/navigation
```

## How the layers fit

```
Server Component (e.g. /items/[id])
    │
    ├─ requireAuth()  ──► reads cookie → User { id, roles, token }
    │
    ├─ itemsApi().get(...)  ─►  starter-api over HTTP
    │       (Authorization: Bearer <userid>:<roles>)
    │
    └─ itemPermissionMap(user, id)  ─►  Cerbos PDP (gRPC)
              │
              └─ pass result to <PermissionsProvider> in JSX
                       │
                       └─ <Can action="update">…</Can>  (client)
```

## Auth: the starter shim

`src/lib/auth.ts` reads a dev cookie `plinth_dev_user`, formatted as `<userid>:<role1>,<role2>`. The same value is forwarded as `Authorization: Bearer ...` to `starter-api`, which understands the same format. **This is for local development only**.

Replace with your project's real auth before production. Drop-in candidates: [Auth0](https://auth0.com), [Clerk](https://clerk.com), [Stack](https://stack-auth.com), homegrown OIDC. The contract is `User { id, roles, token }` from `getCurrentUser`/`requireAuth` — keep that shape and the rest of the app continues to work unchanged.

## Customisation checklist

After cloning:

1. **`cp .env.example .env.local`** and edit. The Quick Start mentions this; calling it out in the checklist too.
2. `package.json` — `name`, `description`, `repository`.
3. `src/lib/env.ts` — your env keys; never read `process.env.X` directly elsewhere.
4. `src/lib/auth.ts` — replace the dev cookie reader with real auth.
5. **Delete the dev-auth shortcuts:** `src/app/sign-in/`, `src/app/sign-out/`, and the `<Link href="/sign-in?as=...">` block in `src/app/page.tsx`. These are gated to non-production builds as defence-in-depth, but the cleanest move is to remove them when you wire real auth.
6. `src/app/items/` — rename / extend for your resource(s).
7. `next.config.ts` — production CSP `connect-src`. **Important:** the default `connect-src 'self'` will block fetches to your `API_BASE_URL` the moment it's not same-origin (and the default `localhost:8080` is cross-origin in any non-localhost deploy). Add your API origin (and OTel collector, if used) here.
8. `src/app/globals.css` — restyle to your brand.

## Production hardening

The starter is *clone-ready*, not *production-ready out of the box*. Before deploying:

- **Remove the dev-auth shortcuts.** `/sign-in?as=<userid>:<roles>` mints an impersonation cookie for any caller — it has no CSRF protection. The route returns 404 in production builds (see `src/app/sign-in/page.tsx`), but treat that as defence-in-depth and *delete the directory entirely* when you replace the auth shim.
- Replace the auth shim wholesale (`src/lib/auth.ts`).
- **CSP `connect-src`:** the default `'self'` will block your client-side calls the moment `API_BASE_URL` is not same-origin. Add your API host (and OTel collector, if used) to `next.config.ts`.
- Set `NEXT_PUBLIC_OTEL_EXPORTER_ENDPOINT` to your collector (the default is empty).
- Ensure `API_BASE_URL` points at your real API; rotate any hard-coded URLs.
- The starter writes session cookies with `secure` only when `NODE_ENV=production` — that's deliberate but verify it before shipping.

## Compatibility

- **Next.js 16+**.
- **Node 20+**.
- **React 19+**.
- **Tailwind CSS v4** (using the `@tailwindcss/postcss` plugin).

## Related

- [`starter-api`](https://github.com/plinth-dev/starter-api) — the matching Go backend.
- [`sdk-ts`](https://github.com/plinth-dev/sdk-ts) — the SDK packages this starter imports.
- [`platform`](https://github.com/plinth-dev/platform) — the Kubernetes Helm chart for the surrounding stack.

## License

MIT — see [LICENSE](./LICENSE).
