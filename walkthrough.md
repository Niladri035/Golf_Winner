# Deployment Walkthrough: AltruGreen

This walkthrough explains the changes made and the steps to complete the deployment.

## Changes Made

### Backend (Render)
- **`render.yaml`**: Added to the root directory. This file automates the creation of a Web Service on Render.
- **`backend/src/app.ts`**: Updated CORS configuration to use `env.CLIENT_URL` if provided, ensuring secure communication between frontend and backend in production.

### Frontend (Vercel)
- **Verification**: Confirmed that the frontend uses `process.env.NEXT_PUBLIC_API_URL` for API requests, making it easy to point to the Render backend.

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
1. Create a new Project on Vercel.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `frontend`.
4. Add the following environment variable:
   - `NEXT_PUBLIC_API_URL`: The Render backend URL followed by `/api` (e.g., `https://golf-charity-backend.onrender.com/api`).
5. Vercel will automatically detect the Next.js framework and build your project.

## Verification
- Visit your Vercel URL.
- Check the browser console and network tab to ensure API calls are hitting the Render backend.
- Verify that features like login and data fetching are working correctly.
