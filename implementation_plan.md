# Golf Charity Subscription Platform — Implementation Plan

## Overview
A production-grade, full-stack SaaS platform where golf players subscribe monthly/yearly, submit scores, participate in charity-driven prize draws, and contribute to selected charities. The UI must feel AWWWARDS-level: emotional, premium, animated.

---

## User Review Required

> [!IMPORTANT]
> **Stripe Keys & Third-Party Services**: You will need to provide `.env` values for Stripe (publishable + secret key, webhook secret), MongoDB URI, Cloudinary, Redis URL, and JWT secret before the backend is runnable.

> [!WARNING]
> **Scope**: This is an extremely large project (~60+ files). The build will be staged: Backend first, then Frontend. Both will be scaffolded in the same monorepo under `c:\Users\santr\Documents\AltruGreen`.

> [!NOTE]
> **Monorepo Layout**: `/backend` (Express API) and `/frontend` (Next.js App). A root `README.md` will document how to run each.

---

## Proposed Changes

### Root
#### [NEW] README.md
Monorepo root readme with setup instructions.

#### [NEW] .env.example
Template for both backend and frontend env vars.

---

### Backend — `/backend`

#### [NEW] package.json + tsconfig.json
Express + TypeScript setup with all deps (mongoose, stripe, zod, cloudinary, redis, node-cron, helmet, express-rate-limit, jsonwebtoken, bcryptjs, multer, axios, cors, dotenv).

#### [NEW] src/config/
- `db.ts` — MongoDB connection via Mongoose
- `stripe.ts` — Stripe client init
- `cloudinary.ts` — Cloudinary config
- `redis.ts` — Redis client (ioredis)
- `env.ts` — Zod-validated env vars

#### [NEW] src/models/
- `User.ts` — name, email, password, role, subscriptionStatus, stripeCustomerId, selectedCharity, charityPercentage, scores[]
- `Charity.ts` — name, description, images[], events[], isFeatured, totalContributions
- `Draw.ts` — drawnNumbers[], mode (random/weighted), prizePool, status, month
- `Winner.ts` — userId, drawId, matchType (3/4/5), prizeAmount, proofImage, status, paymentStatus
- `Subscription.ts` — userId, stripeSubscriptionId, plan (monthly/yearly), status, currentPeriodEnd

#### [NEW] src/middlewares/
- `auth.ts` — JWT verify, attach user to req
- `role.ts` — Admin-only guard
- `errorHandler.ts` — Global error middleware
- `validate.ts` — Zod schema middleware factory
- `upload.ts` — Multer + Cloudinary stream

#### [NEW] src/modules/auth/
- `auth.schema.ts` — Zod schemas (register, login)
- `auth.controller.ts` — register, login handlers
- `auth.service.ts` — bcrypt, JWT sign/verify
- `auth.routes.ts`

#### [NEW] src/modules/user/
- `user.controller.ts` — profile, update charity/percentage
- `user.service.ts`
- `user.routes.ts`

#### [NEW] src/modules/subscription/
- `subscription.controller.ts` — create checkout session, portal
- `subscription.service.ts` — Stripe integration
- `subscription.routes.ts`
- `webhook.controller.ts` — Stripe webhook handler for all events

#### [NEW] src/modules/score/
- `score.schema.ts` — Zod: value 1–45, date
- `score.controller.ts` — CRUD + rolling logic
- `score.service.ts`
- `score.routes.ts`

#### [NEW] src/modules/draw/
- `draw.engine.ts` — Random mode + weighted frequency mode
- `draw.controller.ts` — manual trigger (admin), get results
- `draw.service.ts` — match detection, prize split, rollover
- `draw.routes.ts`

#### [NEW] src/modules/charity/
- `charity.controller.ts` — CRUD
- `charity.service.ts`
- `charity.routes.ts`

#### [NEW] src/modules/winner/
- `winner.controller.ts` — upload proof, get status
- `winner.service.ts`
- `winner.routes.ts`

#### [NEW] src/modules/admin/
- `admin.controller.ts` — user table, draw mode toggle, analytics
- `admin.service.ts`
- `admin.routes.ts`

#### [NEW] src/jobs/
- `monthlyDraw.job.ts` — node-cron monthly draw + prize distribution + rollover

#### [NEW] src/utils/
- `jwt.ts`, `hash.ts`, `apiError.ts`, `asyncWrapper.ts`, `prizePool.ts`

#### [NEW] src/app.ts + src/server.ts

---

### Frontend — `/frontend`

#### [NEW] Next.js 14 App Router scaffold
Using `create-next-app` with TypeScript, SCSS, App Router. ShadCN initialized.

#### [NEW] Design System (`/styles/`)
- `_variables.scss` — color tokens matching exact palette
- `_typography.scss` — Inter/Poppins from Google Fonts
- `_globals.scss` — reset, smooth scroll, base
- `_animations.scss` — reusable keyframes

#### [NEW] Providers (`/app/providers.tsx`)
- Framer Motion `<AnimatePresence>`
- Zustand store initialization
- Lenis smooth scroll setup
- Theme provider (dark/light)

#### [NEW] Components (`/components/`)

**Global:**
- `Loader.tsx` — animated charity-themed intro loader
- `CursorGlow.tsx` — custom cursor with glow effect
- `MagneticButton.tsx` — GSAP magnetic hover
- `NavBar.tsx` — glass nav with dark/light toggle
- `Footer.tsx`

**Homepage sections:**
- `HeroSection.tsx` — large animated headline, GSAP scroll bg, CTA glow
- `HowItWorksSection.tsx` — step cards with scroll animation
- `CharityImpactSection.tsx` — emotional storytelling, stat counters
- `DrawPreviewSection.tsx` — animated number reels
- `TestimonialsSection.tsx` — carousel with real-feeling fake data
- `FinalCTASection.tsx`

**Auth:**
- `LoginForm.tsx` / `SignupForm.tsx` — React Hook Form + Zod, split-screen layout
- `AuthTransition.tsx` — Framer Motion between states

**Dashboard:**
- `SubscriptionStatus.tsx` — active/inactive badge
- `RenewalCountdown.tsx` — animated countdown timer
- `ScoreWidget.tsx` — last 5 scores cards
- `CharitySlider.tsx` — percentage slider with real-time feedback
- `ParticipationSummary.tsx`
- `WinningsOverview.tsx`

**Score Management:**
- `ScoreInput.tsx` — form with date picker, 1–45 validation
- `ScoreList.tsx` — reverse chrono, replace animation
- `ScoreChart.tsx` — Recharts bar chart

**Draw System:**
- `JackpotCounter.tsx` — GSAP number rolling
- `NumberReveal.tsx` — lottery-style animated reveal
- `DrawResults.tsx` — 3/4/5 match display

**Charity:**
- `CharityCard.tsx` — hover tilt effect
- `CharityFilters.tsx` — search + category filter
- `DonationSlider.tsx`

**Winner Verification:**
- `ProofUpload.tsx` — drag & drop
- `StatusBadge.tsx`
- `VerificationTimeline.tsx` — animated steps

**Admin:**
- `UserTable.tsx` — sortable/filterable data table
- `DrawControlPanel.tsx` — mode toggle, manual run
- `CharityCRUD.tsx` — modal-based CRUD
- `WinnerPanel.tsx` — approve/reject UI
- `AnalyticsCharts.tsx` — Recharts dashboards

#### [NEW] Pages (App Router)
- `/app/page.tsx` — Homepage
- `/app/auth/login/page.tsx`
- `/app/auth/signup/page.tsx`
- `/app/(dashboard)/layout.tsx`
- `/app/(dashboard)/dashboard/page.tsx`
- `/app/(dashboard)/scores/page.tsx`
- `/app/(dashboard)/draw/page.tsx`
- `/app/(dashboard)/charities/page.tsx`
- `/app/(dashboard)/charities/[id]/page.tsx`
- `/app/(dashboard)/verify/page.tsx`
- `/app/(dashboard)/pricing/page.tsx`
- `/app/admin/layout.tsx`
- `/app/admin/page.tsx`
- `/app/admin/users/page.tsx`
- `/app/admin/draws/page.tsx`
- `/app/admin/charities/page.tsx`
- `/app/admin/winners/page.tsx`

#### [NEW] State (`/store/`)
- `authStore.ts` — user, token, login/logout
- `subscriptionStore.ts`
- `drawStore.ts`
- `charityStore.ts`

#### [NEW] API layer (`/lib/api/`)
- `axios.ts` — base instance with JWT interceptor
- `auth.api.ts`, `score.api.ts`, `draw.api.ts`, `charity.api.ts`, `winner.api.ts`, `admin.api.ts`

---

## Verification Plan

### Automated Tests (Backend)
```bash
cd backend
npm run dev
# Then use curl or the browser to hit:
# POST /api/auth/register
# POST /api/auth/login
# POST /api/scores (with Bearer token)
# GET  /api/scores
# GET  /api/charities
# GET  /api/admin/analytics (admin token)
```

### Build Verification (Frontend)
```bash
cd frontend
npm run build
# Must complete with 0 TypeScript errors
npm run dev
# Visual inspection in browser at http://localhost:3000
```

### Manual Visual Verification
1. Open `http://localhost:3000` — verify hero animation, cursor glow, loader
2. Navigate to `/auth/login` — verify split-screen, form validation
3. Navigate to `/pricing` — verify plan toggle, card hover effects
4. Navigate to `/dashboard` — verify all widgets, countdown timer
5. Navigate to `/admin` — verify tables, charts, draw control panel
