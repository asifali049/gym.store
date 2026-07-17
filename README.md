# Fitness Platform Monorepo

Premium fitness supplement e-commerce platform.

## Structure
- `apps/web` - Next.js storefront
- `apps/api` - NestJS backend API
- `apps/admin` - Admin dashboard
- `packages/*` - Shared config, UI, types, utils

## Getting Started
```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Requires Node 20+, pnpm 9+, PostgreSQL, Redis running locally.
