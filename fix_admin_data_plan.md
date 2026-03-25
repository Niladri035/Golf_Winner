# Implementation Plan - Fix Missing Admin Data and Analytics

This plan addresses the "No data" issue on the Winner Verification page and the "0" values on the Admin Dashboard by aligning the status strings and data structures between the frontend and backend.

## Proposed Changes

### Backend

#### [MODIFY] [admin.service.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/modules/admin/admin.service.ts)
- Update `getAnalytics` to:
    - Include `pending_review` winners count as `pendingVerifications`.
    - Structure the returned object to match the frontend's expectations (nested `revenueMetrics`, `subscriptionMetrics`, `winnerMetrics`, `charityMetrics`, `userMetrics`).
    - Add `newUsersThisMonth` to `userMetrics`.

### Frontend

#### [MODIFY] [admin.api.ts](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/lib/api/modules/admin.api.ts)
- Update `getPendingWinners` to use `status=pending_review` to match the backend model.

## Verification Plan

### Manual Verification
1.  **Winner Verification Page**:
    - Ensure there are winners with `status: 'pending_review'` in the database.
    - Refresh the Winner Verification page and verify that winners are now displayed.
2.  **Admin Dashboard**:
    - Refresh the Admin Dashboard.
    - Verify that "Total Revenue", "Subscribers", "Pending Verifications", and "Charity Impact" now show correct values instead of 0.
    - Verify "Platform Activity" section shows correct user counts.
