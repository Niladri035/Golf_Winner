# Implementation Plan - Deploy both Frontend and Backend to Vercel

This plan details the steps to deploy the AltruGreen monorepo on Vercel as two separate projects (Frontend and Backend).

## Proposed Changes

### Backend

#### [MODIFY] [server.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/server.ts)
- Modify `bootstrap` to return the `app` instance.
- Conditional `app.listen` based on whether the environment is serverless (using `process.env.VERCEL`).

#### [NEW] [api/index.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/api/index.ts)
- Create a serverless entry point that exports the Express app.
- Ensure `connectDB()` and `getRedis()` are initialized on the backend.

#### [NEW] [vercel.json](file:///c:/Users/santr/Documents/AltruGreen/backend/vercel.json)
- Configure Vercel to route all requests (`/api/(.*)`) to the serverless entry point.
- Set up build/install command if necessary.

### Frontend

#### [MODIFY] [request.ts](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/lib/api/request.ts)
- Update `baseURL` to use `process.env.NEXT_PUBLIC_API_URL` with a fallback to `http://localhost:5000/api`.

## Deployment Instructions

### 1. Backend Deployment
- Create a new project on Vercel and point it to the `backend` directory.
- Add all environment variables from `backend/.env` to the Vercel project settings.
- Ensure `MONGO_URI` is accessible from the Vercel IP range (0.0.0.0/0).

### 2. Frontend Deployment
- Create another new project on Vercel and point it to the `frontend` directory.
- Add `NEXT_PUBLIC_API_URL` pointing to your backend Vercel URL (e.g., `https://altrugreen-api.vercel.app/api`).

## Verification Plan

### Automated Tests
- Run `npm run build` in both directories locally to ensure no build errors.

### Manual Verification
- Access the deployed frontend URL.
- Log in and verify that the dashboard correctly fetches data from the deployed backend URL.
- Test the health check endpoint at `backend-url/health`.
