# AltruGreen Frontend Finalization Plan

This plan outlines the final steps to complete the Golf Charity Subscription Platform frontend, focusing on the winner proof-of-life workflow, administrative controls, and storytelling pages.

## Proposed Changes

### [Winner Workflow]
Handle the end-to-end flow for draw winners.

#### [NEW] [winner-verification.tsx](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/app/dashboard/winner-verification/page.tsx)
- Page for winners to upload proof (video/photo) of their prize receipt.
- Integrates with the backend `WinnerController` and Cloudinary.

#### [NEW] [winner.api.ts](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/lib/api/modules/winner.api.ts)
- API methods for submitting proof and checking win status.

### [Admin Console]
Secure area for managing the platform.

#### [NEW] [admin/page.tsx](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/app/admin/page.tsx)
- High-level analytics (revenue, churn, charity distribution).

#### [NEW] [admin/winners/page.tsx](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/app/admin/winners/page.tsx)
- Verification console for approving/denying winner proof.

#### [NEW] [admin/charities/page.tsx](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/app/admin/charities/page.tsx)
- CRUD interface for platform charities.

### [Storytelling & Polish]
Enhance the premium feel and provide platform transparency.

#### [NEW] [how-it-works/page.tsx](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/app/how-it-works/page.tsx)
- Interactive walkthrough of the draw process and charitable impact.

#### [NEW] [about/page.tsx](file:///C:/Users/santr/Documents/AltruGreen/frontend/src/app/about/page.tsx)
- Mission statement and environmental goals.

## Verification Plan

### Automated Tests
- Integration tests for the winner proof submission flow.

### Manual Verification
- Walkthrough of a simulated draw:
    1. Run a draw manually.
    2. Log in as a winner.
    3. Upload proof.
    4. Verify as an admin.
    5. Check the leaderboard for impact updates.
