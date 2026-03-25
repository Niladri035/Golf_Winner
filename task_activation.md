# Task Management - Admin Activation Features

- [x] Research user management and activation logic <!-- id: 0 -->
- [x] Create implementation plan <!-- id: 1 -->
- [x] Implement backend changes <!-- id: 2 -->
    - [x] Ensure admins are always active in `userService.getDashboard` <!-- id: 3 -->
    - [x] Add `activateUser` method in `adminService` <!-- id: 4 -->
    - [x] Add endpoint handles in `admin.controller` and `admin.routes` <!-- id: 5 -->
- [x] Implement frontend changes <!-- id: 6 -->
    - [x] Add `activateUser` in `adminApi` <!-- id: 7 -->
    - [x] New User Management page: `admin/users/page.tsx` <!-- id: 8 -->
    - [x] Add link to User Management in Admin Console <!-- id: 9 -->
- [x] Verify changes <!-- id: 10 -->
    - [x] Check if Super Admin is now "Active" <!-- id: 11 -->
    - [x] Test activating a regular user as an admin <!-- id: 12 -->
