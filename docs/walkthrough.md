# AltruGreen Platform Walkthrough

The AltruGreen platform is now fully stabilized and polished for a premium golf-charity experience.

## 🚀 Key Features

### 1. Global Impact Leaderboard
- **Dynamic Podium**: Showcases the top 3 donors with premium visual effects (Trophy, Medal, Award).
- **Live Data**: Powered by a robust Redis-cached aggregation of charity contributions.
- **Brand Aligned**: Uses the `$primary-dark` (#780000) and `$accent-blue` (#669bbc) palette.

### 2. The Draw
- **Real-time Results**: Shows the latest winning numbers and prize breakdowns.
- **Jackpot Status**: Dynamic notifications for rollover amounts.
- **Admin Control**: Manual simulation tool available for immediate draw generation.

### 3. Admin Console
- **User Management**: Unified interface for tracking member scores and status.
- **Charity Verification**: Streamlined flow for approving winner "proof-of-life" submissions.
- **Charity Console**: CRUD operations for managing vetted partners.

## 🛠️ Technical Stability
- **Authentication**: Resolved critical login 500 errors and implemented RBAC.
- **Data Integrity**: Guarded against `$NaN` and `undefined` mapping errors in the UI.
- **Performance**: Integrated Redis caching for public-facing leaderboard data.

## 🔑 Administrative Access
- **Email**: `admin@altrugreen.com`
- **Password**: `admin@altrugreen.com`

---
*Created by Antigravity — Your Premium Coding Assistant.*
