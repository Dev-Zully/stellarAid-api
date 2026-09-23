# Contributing to lumora-services

This document explains how the repository is organized and the conventions every
change is expected to follow. It is the source of truth for structure and style
questions — when code and this document disagree, fix the code or update this
document in the same change.

## Prerequisites

- Node.js **>= 20**
- npm **>= 10**
- git

## Getting started

```bash
npm install          # also installs git hooks via the `prepare` script
cp .env.example .env # optional — defaults work out of the box
npm run dev
```

The server listens on `PORT` (default `3000`). Sanity check it:

```bash
curl http://localhost:3000/health
# {"status":"ok","uptime":4.2,"timestamp":"2026-09-23T09:00:00.000Z"}
```

## npm scripts

| Script                 | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Start the dev server with ts-node-dev (restarts on file change) |
| `npm run build`        | Compile to `dist/` (tsc) and rewrite path aliases (tsc-alias)   |
| `npm start`            | Run the compiled server from `dist/`                            |
| `npm run typecheck`    | Type-check the project without emitting files                   |
| `npm run lint`         | Run ESLint over the repository                                  |
| `npm run lint:fix`     | Run ESLint and auto-fix what it can                             |
| `npm run format`       | Rewrite files with Prettier                                     |
| `npm run format:check` | Verify formatting without writing files                         |

## Project structure

```
src/
├── app.ts          # Express application factory (middleware + routers)
├── index.ts        # Entry point: starts the server, handles graceful shutdown
├── config/         # Reads and validates environment variables
├── controllers/    # HTTP handlers — thin, delegate to services
├── middlewares/    # Cross-cutting concerns (404s, error handler, auth, …)
├── queues/         # Background job queue definitions (BullMQ, placeholder)
├── routes/         # Route definitions mounted by app.ts via the api router
├── services/       # Business logic — no HTTP concepts in here
├── types/          # Shared cross-cutting types
├── utils/          # Small shared helpers (logger)
├── validators/     # Request validation schemas (placeholder)
└── workers/        # Background job processors (BullMQ, placeholder)
```

Folders that are placeholders today (`queues/`, `workers/`, `validators/`)
carry a doc comment explaining what belongs there. Delete a placeholder only
when the real module replaces it.

## Conventions

### Layering

A request flows through exactly one path:

```
route → controller → service
```

- **routes** define endpoints and delegate straight to controllers. No
  business logic lives here.
- **controllers** translate HTTP to service calls and shape the response. If a
  controller grows, the logic belongs in a service.
- **services** hold business logic and know nothing about HTTP — no `req`/`res`,
  no status codes.
- **validators** prove requests match the expected shape before they reach a
  controller.
- **middlewares** handle cross-cutting concerns for every request (error
  handling, 404s, and later auth or rate limiting).
- **queues / workers** own background processing: queues produce jobs, workers
  consume them. Keep both free of HTTP concerns.

### Naming

- Files are `kebab-case`.
- Feature files carry a role suffix: `health.controller.ts`,
  `donations.routes.ts`, `auth.validator.ts`, `error-handler.middleware.ts`.
- Infrastructure folders (`config/`, `utils/`, `types/`) use plain names
  (`env.ts`, `logger.ts`).
- Functions and variables are `camelCase`; types and interfaces are
  `PascalCase`.

### Imports and path aliases

`tsconfig.json` maps `@/*` to `src/*`.

- Cross-folder imports always use the alias: `import { env } from '@/config'`.
- Same-folder imports stay relative: `import { createApp } from './app'`.
- Import from the folder barrel (`@/services`), not deep paths
  (`@/services/health.service`) — each folder's `index.ts` is its public API.
- Prefer `import type` for type-only imports.

### Environment variables

- Nothing outside `src/config/env.ts` may read `process.env`.
- Add new variables there, with validation and a sensible default, plus an
  entry in `.env.example`.
- There is no `dotenv` dependency. Pass variables through your shell, or run
  the built server with `node --env-file=.env dist/index.js`.

### Formatting and linting

- Prettier owns formatting (`.prettierrc`); ESLint owns code quality
  (`eslint.config.js`, flat config). `eslint-config-prettier` keeps the two out
  of each other's way.
- Run `npm run lint` and `npm run format:check` before pushing.

### Git hooks

- `husky` installs a pre-commit hook that runs `lint-staged`, which applies
  ESLint `--fix` and Prettier to staged `.ts` files (and Prettier to staged
  JSON/Markdown). Code that fails lint cannot be committed.
- Hooks are installed automatically by `npm install` (via the `prepare`
  script). If hooks seem missing, run `npm run prepare`.

## Adding a new endpoint

1. Create `src/services/<feature>.service.ts` with the business logic.
2. Create `src/controllers/<feature>.controller.ts` — a thin HTTP wrapper.
3. Create `src/routes/<feature>.routes.ts` wiring routes to the controller.
   Validate inputs with a schema in `src/validators/`.
4. Export the new pieces from each folder's `index.ts` barrel.
5. Mount the router in `src/routes/index.ts`.
6. Run `npm run lint && npm run typecheck && npm run dev` and exercise the
   endpoint.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):
`feat: add donation webhook endpoint`, `fix: guard against empty payloads`,
`chore: bump dependencies`.

## Fail fast on bad configuration

`src/config/env.ts` throws on invalid configuration at startup on purpose —
crashing during boot with a clear message beats misbehaving in production.
