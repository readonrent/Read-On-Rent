# Readon Rent Dashboard — Vercel + MongoDB + Supabase

This folder is a standalone Vercel project. It does not modify the repository `frontend/` or `backend/` projects.

## Architecture
- Vercel serverless functions: `/api/*`
- MongoDB Atlas: persistent dashboard state
- Supabase Storage: testing screenshots
- JWT + bcrypt: dashboard authentication

## Required Vercel environment variables
- `JWT_SECRET`
- `ADMIN_USER`
- `ADMIN_PASS_HASH`
- `MONGODB_URI`
- `MONGODB_DB_NAME` (recommended: `readon_rent`)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## MongoDB Atlas
Create a free M0 cluster, a database user, and allow Vercel to reach the cluster. Vercel deployments use dynamic IP addresses, so Atlas may require `0.0.0.0/0` in the IP access list; use a strong database password and least-privilege database user where possible.

## Local development
1. Copy `.env.example` to `.env`.
2. Fill in the environment variables.
3. Run `npm install`.
4. Run `npm start` (requires Vercel CLI).

## Health check
After deployment, open `/api/health`. A healthy response looks like:

```json
{ "ok": true, "database": "readon_rent" }
```

## Security
Never commit `.env`, MongoDB credentials, or the Supabase service-role key.
