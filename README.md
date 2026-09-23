# lumora-services

Express + TypeScript backend service.

## Requirements

- Node.js >= 20

## Quick start

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` — dev server that restarts on file changes
- `npm run build` — compile to `dist/` (with path aliases rewritten)
- `npm start` — run the compiled build
- `npm run lint` / `npm run format` — code quality

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full script table, the project
structure and all conventions.

## Health check

```bash
curl http://localhost:3000/health
```

```json
{ "status": "ok", "uptime": 4.2, "timestamp": "2026-09-23T09:00:00.000Z" }
```

The port is configurable with `PORT` — see `.env.example`.

## API versioning

All feature routes mount under `/api/v1/` (`/api/v1/auth`, `/api/v1/users`,
`/api/v1/artworks`, …). Feature routers are produced by the router factory in
`src/routes/router-factory.ts`. The legacy `/health` probe stays at the root.

## Documentation

Swagger UI is served at http://localhost:3000/api/docs. The OpenAPI 3 spec is
assembled by swagger-jsdoc from `src/swagger.ts` plus `@openapi` JSDoc
annotations in `src/routes/**/*.routes.ts`.

## Rate limiting

| Scope            | Limit   | Header                                            |
| ---------------- | ------- | ------------------------------------------------- |
| Global (all API) | 100/min | RateLimit-Limit / Remaining / Reset               |
| Auth endpoints   | 10/min  | RateLimit-Limit / Remaining / Reset + Retry-After |
| Password reset   | 3/min   | RateLimit-Limit / Remaining / Reset + Retry-After |

Over-limit requests return `429`. The store is the shared in-memory store by
default; set `REDIS_URL` for a Redis-backed store so limits hold across
multiple instances. Requests to `/api/docs` and `OPTIONS` are not counted.

## Request validation

Incoming `body` / `params` / `query` are validated against Zod schemas in
`src/validators/` by the `validate()` middleware. Invalid requests return
`422` with field-level errors and never reach a controller; controllers read
parsed data through `getValidated()`.
