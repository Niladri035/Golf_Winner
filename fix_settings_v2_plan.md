# Implementation Plan - Fix User Settings Save and Navigation

This plan addresses the non-functional "Security" and "Personal Info" buttons and the issue where changes are not saved/reflected in the UI.

## Proposed Changes

### Frontend

#### [MODIFY] [settings/page.tsx](file:///c:/Users/santr\Documents\AltruGreen\frontend\src\app\dashboard\settings\page.tsx)
- Add `activeTab` state to switch between 'profile' and 'security' sections.
- Make "Security" and "Personal Info" buttons functional by updating `activeTab`.
- Import `updateUser` from `useAuthStore`.
- Update `handleSave` to call `updateUser` with the new profile data after a successful backend update.
- Ensure the UI reflects the updated data immediately.

## Verification Plan

### Manual Verification
1.  **Tab Navigation**:
    - Click "Security" and verify the section switches to security settings (dummy content for now).
    - Click "Personal Info" and verify it switches back to profile settings.
2.  **Save and Reflect**:
    - Change name or charity percentage.
    - Click "Save Changes".
    - Verify toast notification success.
    - Navigate back to Dashboard and verify the name and stats are updated.
