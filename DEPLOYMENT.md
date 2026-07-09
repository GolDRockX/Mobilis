# Deploying Mobilis (Free, for Testing)

This guide deploys your app live on the internet using free tiers, **without changing how your local setup works.** Your XAMPP + local MySQL workflow stays exactly as-is.

Stack:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → TiDB Cloud (MySQL-compatible)

---

## Part 1 — Set up TiDB Cloud (free MySQL database)

1. Go to https://tidbcloud.com and sign up (free)
2. Create a new **Serverless** cluster (free tier)
3. Once created, go to **Connect** → copy these details:
   - Host
   - Port (usually `4000`)
   - Username
   - Password (you'll set/generate this)
4. Click the **SQL Editor** tab in TiDB Cloud dashboard
5. Paste the entire contents of `backend/schema.sql` and run it — this creates your tables and the default admin account

Keep this tab open — you'll need these credentials in Part 2.

---

## Part 2 — Deploy Backend to Render

1. Push your project to a GitHub repository (if not already):
   ```bash
   cd mobilis
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/mobilis.git
   git push -u origin main
   ```

2. Go to https://render.com and sign up (free) → connect your GitHub

3. Click **New** → **Web Service** → select your `mobilis` repo

4. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Under **Environment Variables**, add each of these (values from `backend/.env.production.example`):

   | Key | Value |
   |---|---|
   | `PORT` | `5001` |
   | `DB_HOST` | *(from TiDB Cloud)* |
   | `DB_PORT` | `4000` |
   | `DB_USER` | *(from TiDB Cloud)* |
   | `DB_PASSWORD` | *(from TiDB Cloud)* |
   | `DB_NAME` | `mobilisdb` |
   | `DB_SSL` | `true` |
   | `JWT_SECRET` | *(any long random string — different from your local one)* |
   | `BINANCE_API_KEY` | *(leave blank unless you have one)* |
   | `BINANCE_API_SECRET` | *(leave blank unless you have one)* |
   | `CLIENT_URL` | `http://localhost:5173` *(update after Part 3)* |

6. Click **Create Web Service** — wait for it to build and deploy
7. Once live, copy your backend URL, e.g. `https://mobilis-backend.onrender.com`

---

## Part 3 — Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up (free) → connect your GitHub
2. Click **Add New** → **Project** → select your `mobilis` repo
3. Vercel auto-detects Vite — leave build settings as default
4. Under **Environment Variables**, add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://mobilis-backend.onrender.com/api` |
   | `VITE_WS_URL` | `wss://mobilis-backend.onrender.com/ws/btc-price` |

   (Use your actual Render URL from Part 2, step 7)

5. Click **Deploy** — wait for it to finish
6. Copy your live frontend URL, e.g. `https://mobilis.vercel.app`

---

## Part 4 — Connect them together

1. Go back to **Render** → your backend service → **Environment**
2. Update `CLIENT_URL` to:
   ```
   http://localhost:5173,https://mobilis.vercel.app
   ```
   (comma-separated — keeps local dev working too)
3. Render will auto-redeploy with the new setting

---

## Part 5 — Test it

1. Visit your Vercel URL
2. Try logging in with `admin@mobilis.com` / `password`
3. Check the Bitcoin page loads live prices
4. Try generating an API key from Profile and test:
   ```
   https://mobilis-backend.onrender.com/api/v1/btc-price?api_key=YOUR_KEY
   ```

---

## Known limitations (free tier)

- **Cold starts:** Render's free tier sleeps after ~15 min idle. First request after that takes 20-30 seconds.
- **TiDB Cloud free tier** has usage limits — fine for testing, not for real traffic.
- **No custom domain** on free tiers (you get `.onrender.com` and `.vercel.app` subdomains) — fine for testing.

---

## Your local setup is untouched

Nothing about this affects your local development:
- Local `.env` stays the same
- `npm run dev` still runs both frontend + backend locally on your XAMPP MySQL
- The code only switches to production URLs when `VITE_API_URL` / `VITE_WS_URL` / `DB_SSL` are explicitly set — which only happens on Render/Vercel, not on your machine
