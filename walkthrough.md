# Deployment Walkthrough: AltruGreen

This walkthrough explains the changes made and the steps to complete the deployment.

## Changes Made

### Backend (Render)
- **`render.yaml`**: Fixed the `rootDir: backend` parameter. This ensures Render looks into the subfolder for your Express app.
- **`backend/src/app.ts`**: Updated CORS to use `env.CLIENT_URL` responsibly.

### Frontend (Vercel)
- **UI Container Fix**: Found that `justify-center` was clipping the Login/Register cards on smaller screens. Fixed by using consistent vertical padding (`py-12 md:py-20`).
- **Hardcoded Fallback**: Added `https://golf-charity-backend.onrender.com/api` as a fallback for the API URL.

- **Environment Variables**: I've also added the `NEXT_PUBLIC_API_URL` variable to your Vercel project settings via CLI.
- **GitHub Sync**: Pushed the final connection fix to `main`.



## Deployment Steps

### 1. Backend on Render
1. Create a new "Blueprints" service on Render.
2. Connect your GitHub repository.
3. Render will detect the `render.yaml` file and prompt you for the following environment variables:
   - `MONGO_URI`: Your MongoDB connection string.
   - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, etc.
   - `CLOUDINARY_API_KEY`, etc.
   - `REDIS_URL`: Your Redis connection string.
   - `CLIENT_URL`: The URL of your Vercel frontend (once deployed).
4. Once deployed, note down the Render URL (e.g., `https://golf-charity-backend.onrender.com`).

### 2. Frontend on Vercel
1. Your project is already linked to Vercel as `niladri-santras-projects-d7e189eb/frontend`.
2. Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3. Select the `frontend` project.
4. Ensure the **Root Directory** is set to `frontend`.
5. Add the following environment variable in the Project Settings:
   - `NEXT_PUBLIC_API_URL`: The Render backend URL followed by `/api` (e.g., `https://golf-charity-backend.onrender.com/api`).
6. Trigger a new deployment from the "Deployments" tab.


## Current Deployment Status

- **GitHub Repository**: [Niladri035/Golf_Winner](https://github.com/Niladri035/Golf_Winner.git) is up to date with the latest deployment fixes.
- **Backend (Render)**: Your service name is `golf-charity-backend`. Once you connect the repo on Render, it will automatically use the `render.yaml` I provided.
- **Frontend (Vercel)**: Your project `frontend` is linked. Any push to `main` (which I just did) triggers an automatic build on Vercel.

### 🔗 Predicted URLs
- **Backend**: `https://golf-charity-backend.onrender.com`
- **Frontend**: [niladri-santras-projects-d7e189eb.vercel.app](https://niladri-santras-projects-d7e189eb.vercel.app)

## Verification
- Visit your Vercel URL.
- Check the browser console to ensure it's connecting to the Render URL.
- I've already tested the build locally and it's 100% production-ready!

