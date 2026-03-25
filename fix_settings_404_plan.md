# Implementation Plan - Fix Account Settings 404

This plan addresses the 404 error when clicking on the "Account Settings" button in the dashboard by creating a new settings page and updating the link.

## Proposed Changes

### Frontend

#### [NEW] [settings/page.tsx](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/app/dashboard/settings/page.tsx)
- Create a new settings page that allows users to:
    - View their profile (name, email).
    - Update their selected charity and contribution percentage.
    - Use the existing `charityApi.selectForUser` and a new `userApi.updateProfile` call.

#### [MODIFY] [dashboard/page.tsx](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/app/dashboard/page.tsx)
- Update the "Account Settings" button `onClick` handler to navigate to `/dashboard/settings` instead of `/settings`.

#### [NEW] [user.api.ts](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/lib/api/modules/user.api.ts)
- Create a new API module for user-related actions:
    - `getProfile()`: Hits `/users/profile`.
    - `updateProfile(data)`: Hits `PUT /users/profile`.

## Verification Plan

### Manual Verification
1.  **Check Link**:
    - Log in and go to the dashboard.
    - Click "Account Settings".
    - Verify it now navigates to `/dashboard/settings` without a 404.
2.  **Check Settings Functional**:
    - Verify profile data is displayed correctly.
    - Change charity or percentage and save.
    - Verify the change is reflected in the dashboard.
