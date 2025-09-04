# 🚀 Deploy ReWear on Netlify (frontend) + Render (backend)

## 1) Backend on Render

### A. Create the service
1. Go to `https://render.com`
2. New → Web Service → Connect your GitHub repo
3. Root directory: `backend`
4. Environment: `Node`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Instance type: Free (or higher)

### B. Environment variables (Render → Settings → Environment)
- `MONGO_URI` = your Atlas SRV string (with DB name and URL-encoded password)
- `JWT_SECRET` = a long random string
- `CLOUDINARY_CLOUD_NAME` (if using uploads)
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV` = `production`

Click Deploy. After deploy, test:
- `https://your-render-app.onrender.com/health` → `{ "status": "ok" }`
- `https://your-render-app.onrender.com/api/db-status` → should show `connected`

If DB isn’t connected, fix Atlas Network Access (0.0.0.0/0) and MONGO_URI.

### C. Notes for Render
- Render sets `PORT` automatically. Our app reads `process.env.PORT`.
- Dockerfile is provided but optional; the simple Node build is fine.

---

## 2) Frontend on Netlify

### A. Create the site
1. Go to `https://app.netlify.com`
2. Add new site → Import from Git
3. Select the same repo
4. Base directory: `frontend`
5. Build command: `npm run build`
6. Publish directory: `dist`

### B. Environment variables (Netlify → Site settings → Environment)
- `VITE_BACKEND_URL` = `https://your-render-app.onrender.com`

Click Deploy. After deploy, open your Netlify URL and ensure the banner disappears and API calls work.

---

## 3) CORS and endpoints
- Backend CORS expects `FRONTEND_URL` when in production. On Render → add:
  - `FRONTEND_URL` = your Netlify site URL (e.g., `https://rewear.netlify.app`)
- Redeploy backend after changing env vars.

---

## 4) Smoke test
- Frontend: visit the Netlify URL
- Backend: `GET /health`, `GET /api/items`
- If items still time out → fix Atlas access or MONGO_URI.

---

## 5) Troubleshooting quick list
- 404 at `/api/users`: That route doesn’t exist. Use `/api/users/login`, `/api/users/register`, or `/api/users/:id`.
- Mongo timeouts: Atlas IP allowlist, SRV host typo, password encoding, or missing DB name.
- CORS: set `FRONTEND_URL` in Render env and redeploy.
