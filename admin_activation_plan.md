# Implementation Plan - Admin Auto-activation and User Activation

This plan outline the changes needed to ensure that admin users are always considered "Active" on their dashboard and to allow admins to manually activate other users.

## Proposed Changes

### Backend

#### [MODIFY] [user.service.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/modules/user/user.service.ts)
- Update `getDashboard` to return a mock active subscription if the user's role is `admin`. This ensures the dashboard doesn't show "Inactive" for admins.

#### [MODIFY] [admin.service.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/modules/admin/admin.service.ts)
- Add `activateUser(userId: string)` method that:
    - Updates `User.subscriptionStatus` to `'active'`.
    - Creates or updates a `Subscription` document with `status: 'active'` and a far-future expiry date (e.g., 2099).

#### [MODIFY] [admin.controller.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/modules/admin/admin.controller.ts)
- Add `activateUser` handler to call `adminService.activateUser`.

#### [MODIFY] [admin.routes.ts](file:///c:/Users/santr/Documents/AltruGreen/backend/src/modules/admin/admin.routes.ts)
- Add `PATCH /users/:userId/activate` route.

### Frontend

#### [MODIFY] [admin.api.ts](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/lib/api/modules/admin.api.ts)
- Add `activateUser(userId: string)` function.

#### [MODIFY] [admin/page.tsx](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/app/admin/page.tsx)
- Add a button to navigate to the new User Management page.

#### [NEW] [users/page.tsx](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/app/admin/users/page.tsx)
- Create a user management table listing all users.
- Add an "Activate" button for inactive users that calls the new backend endpoint.

## Verification Plan

### Manual Verification
1.  **Admin Auto-activation**: Log in as admin, check dashboard.
2.  **User Activation**: Log in as admin, activate a user, verify their status.
