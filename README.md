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

`.env` must provide `DATABASE_URL`, `JWT_SECRET` and `JWT_REFRESH_SECRET`
(the defaults in `.env.example` work locally); startup fails fast otherwise.

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

## Header policy

Set in `src/app.ts`, in this order:

| Layer         | Policy                                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `helmet`      | Helmet defaults: CSP, HSTS (production), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-DNS-Prefetch-Control`, and others. |
| `cors`        | Credentialed CORS. Origins come from `CORS_ORIGIN` (comma-separated). When unset, the request origin is reflected so any frontend can connect during development.   |
| `compression` | gzip/deflate encoding for compressible responses in every environment.                                                                                              |
| Request ID    | Every response carries `X-Request-Id` (incoming `X-Request-Id` is reused when present, otherwise a UUID is generated) and it appears in that request's log lines.   |

`X-Powered-By` is disabled.
