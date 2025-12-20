# 🚀 Deployment Guide

## Overview

| Component    | Platform        | URL                           |
| :----------- | :-------------- | :---------------------------- |
| **Frontend** | Vercel          | https://your-app.vercel.app   |
| **Backend**  | Render          | https://your-api.onrender.com |
| **Database** | Supabase/Render | (Already set up)              |

---

## 📱 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. **Update API URL** in `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

2. **Test build locally**:

```bash
cd client
npm run build
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard**

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Root Directory**: `client`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend-url.onrender.com`
7. Click "Deploy"

**Option B: Via Vercel CLI**

```bash
cd client
npm i -g vercel
vercel login
vercel --prod
```

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend

1. **Ensure `package.json` has correct scripts**:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "npx prisma generate"
  }
}
```

2. **Test build locally**:

```bash
cd server
npm run build
```

### Step 2: Deploy to Render

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:

   - **Name**: `ctm-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. **Add Environment Variables**:

   ```
   PORT=8000
   DATABASE_URL=<your-supabase-connection-string>
   JWT_SECRET=<generate-a-secure-random-string>
   NODE_ENV=production
   ```

7. Click "Create Web Service"

### Step 3: Run Database Migration

After deployment, open Render Shell and run:

```bash
npx prisma migrate deploy
npx ts-node src/seed.ts
```

---

## 🗄️ Database Options

### Option 1: Keep Supabase (Current)

✅ Already set up

- Just use your existing `DATABASE_URL`

### Option 2: Render PostgreSQL

1. In Render Dashboard → "New +" → "PostgreSQL"
2. Create database
3. Copy "Internal Database URL"
4. Use in backend environment variables

---

## 🔐 Environment Variables Summary

### Frontend (Vercel)

```env
NEXT_PUBLIC_API_URL=https://ctm-backend.onrender.com
```

### Backend (Render)

```env
PORT=8000
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NODE_ENV=production
```

---

## ✅ Post-Deployment Checklist

- [ ] Frontend loads at Vercel URL
- [ ] Backend health check: `https://your-backend.onrender.com`
- [ ] Can register new user
- [ ] Can login
- [ ] Can create/edit/delete tasks
- [ ] Real-time updates work (open 2 tabs)
- [ ] CORS is configured (backend allows frontend origin)

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Ensure backend URL is correct (no trailing slash)
- Check browser console for CORS errors

### Backend crashes on startup

- Check Render logs
- Verify `DATABASE_URL` is correct
- Ensure migrations ran: `npx prisma migrate deploy`

### Database connection fails

- Verify DATABASE_URL format
- Check if Supabase/Render DB is accessible
- Test connection: `npx prisma db pull`

### CORS errors

Add to `server/src/server.ts`:

```typescript
app.use(
  cors({
    origin: "https://your-app.vercel.app",
    credentials: true,
  })
);
```

### Prisma "Permission denied" error

**Error**: `sh: 1: prisma: Permission denied`

**Cause**: Prisma is in `devDependencies` but Render doesn't install dev dependencies in production.

**Solution**: Move `prisma` to `dependencies` in `server/package.json`:

```json
{
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "prisma": "^5.22.0"
    // ... other dependencies
  }
}
```

Then commit and push:

```bash
git add server/package.json
git commit -m "fix: Move Prisma to dependencies for Render deployment"
git push
```

Render will automatically redeploy with the fix.

---

## 📊 Monitoring

- **Vercel**: Check deployment logs and analytics
- **Render**: Monitor service logs and metrics
- **Database**: Check Supabase/Render dashboard

---

## 💰 Cost

| Service  | Free Tier                        |
| :------- | :------------------------------- |
| Vercel   | ✅ Unlimited (hobby projects)    |
| Render   | ✅ 750 hours/month               |
| Supabase | ✅ 500MB database, 2GB bandwidth |

**Total: $0/month** for this project! 🎉
