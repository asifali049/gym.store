# Deploying the API

## 1. Get a production PostgreSQL database
Pick one (all have free tiers):
- **Neon** (neon.tech) — serverless Postgres, easiest for this stack
- **Supabase** (supabase.com) — Postgres + extras
- **Railway** — if deploying the API on Railway too, add a Postgres plugin from the same project

Copy the connection string — this becomes `DATABASE_URL`.

## 2. Deploy the API (choose one)

### Option A — Railway
1. railway.app → New Project → Deploy from GitHub repo → select `gym.store`
2. Railway auto-detects `railway.json` → builds `apps/api/Dockerfile`
3. Add environment variables (Settings → Variables):
   - `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN` (your web app's URL)
4. Deploy — Railway gives you a public URL like `https://api-production-xxxx.up.railway.app`

### Option B — Render
1. render.com → New → Blueprint → connect the repo (`render.yaml` is auto-detected)
2. Fill in the env vars it prompts for (`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CORS_ORIGIN`)
3. Deploy — Render gives a URL like `https://fitness-platform-api.onrender.com`

Either way, migrations run automatically on boot (`prisma migrate deploy`), so the schema is created on first deploy.

## 3. Connect the frontend apps
In Vercel (both `web` and `admin` projects) → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://<your-deployed-api-url>/api/v1
```
Redeploy both after adding this so the build picks it up.

## 4. Verify
- `https://<api-url>/api/v1` should respond (even a 404 JSON means it's alive)
- `https://<api-url>/api/docs` — Swagger UI, lists every endpoint
- Try registering a user from Swagger, then confirm it shows up via `GET /users` (admin token needed)
