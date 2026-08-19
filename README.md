# 📚 Read on Rent — Monorepo

Single repository containing both the backend (`/backend`) and frontend (`/frontend`) for the Read on Rent book rental platform. Deploys to two separate services (Render + Vercel) from this one repo, using each platform's "Root Directory" setting.

```
read-on-rent/
├── backend/     → deploys to Render
└── frontend/    → deploys to Vercel
```

## 1. Push this repo to GitHub

```bash
cd read-on-rent-monorepo
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/read-on-rent.git
git push -u origin main
```

## 2. MongoDB Atlas (database)

1. [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → free account → free-tier cluster
2. **Database Access** → add a user, save the password
3. **Network Access** → Add IP → `0.0.0.0/0`
4. **Connect** → copy the connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/read-on-rent?retryWrites=true&w=majority
   ```

## 3. Backend on Render (from this same repo)

1. [render.com](https://render.com) → **New → Web Service** → connect this GitHub repo
2. **Root Directory**: `backend`   ← this is the key setting that makes one repo work
3. **Environment**: Node
4. **Build Command**: `npm install`
5. **Start Command**: `npm start`
6. **Environment Variables**:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | any long random string |
   | `JWT_EXPIRE` | `7d` |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `FRONTEND_URL` | fill in after step 4, once you have the Vercel URL |

7. **Create Web Service**, wait for it to build, then confirm it's alive at `https://your-backend.onrender.com/health`

Seed the database (run locally, pointed at Atlas):
```bash
cd backend
MONGODB_URI="your-atlas-uri" npm run seed:all
```

## 4. Frontend on Vercel (same repo, different subfolder)

1. [vercel.com](https://vercel.com) → **Add New → Project** → import the **same** GitHub repo
2. **Root Directory**: `frontend`   ← same trick as Render
3. **Framework Preset**: Vite (auto-detected)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://your-backend.onrender.com/api` |

7. **Deploy**, then copy your Vercel URL (e.g. `https://read-on-rent.vercel.app`)

## 5. Connect them — fix CORS

Go back to **Render → backend service → Environment**, set:
```
FRONTEND_URL = https://read-on-rent.vercel.app
```
Save — Render auto-redeploys. Without this, the backend rejects requests from your Vercel domain.

## 6. Test it

Open your Vercel URL → register an account → browse/rent a book → check `/admin` with an admin account.

## Ongoing deploys

Both Render and Vercel watch this one repo. Any push to `main` triggers **both** services to rebuild automatically, since neither platform does path-based build filtering on the free tier — a change to `frontend/` will also trigger a backend rebuild and vice versa. That's harmless (Render/Vercel just rebuild something identical to before), but worth knowing if you want to optimize it later with Render's paid "build filters" or a CI check that skips deploys for unrelated paths.

```bash
git add .
git commit -m "some change"
git push
```

## Notes

- **Render free tier** spins down after 15 minutes idle — first request after that takes ~30-50s to wake up.
- Demo login after seeding: `test@example.com` / `password`. Admin: `admin@readonrent.com` / `Admin@12345` (or whatever you set via `ADMIN_EMAIL`/`ADMIN_PASSWORD` before seeding).
- See `backend/README.md` and `frontend/README.md` for details specific to each half of the project.
