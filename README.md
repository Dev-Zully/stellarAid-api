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
