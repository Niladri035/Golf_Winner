# Deployment Plan: AltruGreen

This plan outlines the steps to deploy the backend to Render and the frontend to Vercel.

## Proposed Changes

### [Backend] (Render)
#### [NEW] [render.yaml](file:///c:/Users/santr/Documents/AltruGreen/render.yaml)
Create a `render.yaml` file to define the backend service, its build command, start command, and environment variables.

#### [MODIFY] [env.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/config/env.ts)
Ensure `PORT` and `CLIENT_URL` are correctly handled for production.

### [Frontend] (Vercel)
#### [MODIFY] [vercel.json](file:///c:/Users/santr/Documents/AltruGreen/frontend/vercel.json)
Ensure the root directory and build settings are correct for a Next.js deployment.

## Verification Plan

### Automated Tests
- Run `npm run build` in both `backend` and `frontend` to ensure they compile correctly.
- Run `npm test` in `backend` to ensure core logic is sound.

### Manual Verification
- Deploy to Render (staging/preview if possible).
- Deploy to Vercel (preview deployment).
- Verify the connection between frontend and backend via the `NEXT_PUBLIC_API_URL` environment variable.
