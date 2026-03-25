# Walkthrough - Vercel Deployment & Subscription Pricing

I have completed the configuration for deploying AltruGreen to Vercel and updated the subscription pricing as requested.

## Changes Made

### 1. Vercel Deployment Configuration
-   **Backend**:
    -   Created [vercel.json](file:///c:/Users/santr/Documents/AltruGreen/backend/vercel.json) to handle serverless routing of all `/api/*` requests.
    -   Created [api/index.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/api/index.ts) as the serverless entry point that exports the Express app and handles database connections.
-   **Frontend**:
    -   Verified that the API base URL is dynamic and correctly uses the `NEXT_PUBLIC_API_URL` environment variable.
-   **Infrastructure**:
    -   Created a global [.gitignore](file:///c:/Users/santr/Documents/AltruGreen/.gitignore) to prevent pushing `node_modules` and build artifacts to GitHub, which significantly reduces build times and repo size.

### 2. Subscription Pricing Update
-   Updated the [Subscribe Page](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/app/subscribe/page.tsx):
    -   Monthly: Now **$10/month** (previously $25).
    -   Yearly: Now **$100/year** (previously $250).
    -   Savings Badge: Updated to "Save $20" to reflect the new discount.

## How to Deploy

Since I encountered a permission error while pushing to your GitHub repository (likely due to branch protection or SSH/HTTPS authentication), please perform the following steps to finish the deployment:

1.  **Sync Code**:
    ```bash
    git add .
    git commit -m "Configure Vercel deployment and update prices"
    git push origin main
    ```
2.  **Vercel Setup**:
    -   **Backend**: Create a Vercel project pointing to the `backend` folder. Add your `.env` variables in the Vercel dashboard.
    -   **Frontend**: Create a Vercel project pointing to the `frontend` folder. Add `NEXT_PUBLIC_API_URL` pointing to your backend URL.

## Technical Details
-   The backend now uses `@vercel/node` to run the Express app as a serverless function.
-   The `connectDB` function was verified to work correctly in a serverless environment (handling warm/cold starts).
