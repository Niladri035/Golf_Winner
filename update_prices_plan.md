# Implementation Plan - Update Subscription Prices

This plan updates the subscription pricing displayed on the website to $10/month and $100/year.

## Proposed Changes

### Frontend

#### [MODIFY] [subscribe/page.tsx](file:///c:/Users/santr/Documents/AltruGreen/frontend/src/app/subscribe/page.tsx)
-   Change Monthly Membership price from $25 to $10 (Line 71).
-   Change Annual Membership price from $250 to $100 (Line 109).
-   Change "Save $50" to "Save $20" for the Annual Membership badge (Line 98).

### Backend (Configuration Only)
-   The backend code already uses environment variables for Stripe Price IDs. No code changes are required, but the user must be notified to update their `.env` file once they create the new prices in Stripe.

## Verification Plan

### Manual Verification
1.  **Check Pricing UI**:
    -   Navigate to the `/subscribe` page.
    -   Verify the monthly plan shows $10/month.
    -   Verify the yearly plan shows $100/year.
    -   Verify the yearly badge says "Best Value (Save $20)".
