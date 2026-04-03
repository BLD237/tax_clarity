# TaxClarity Cameroon (Web) — React Migration Spec

## Purpose
TaxClarity Cameroon helps users understand which Cameroon taxes apply to them, estimate monthly take‑home pay (IRPP + CNPS), and export/share a tax report PDF. This document specifies the **React web** version (responsive + desktop) and breaks implementation into concrete tasks.

## Current Flutter functionality (source of truth)
- **Auth**: Email/password sign up + sign in via Supabase Auth, including “pending email confirmation” messaging.
- **Onboarding**:
  - Identity selection (separate screen).
  - Step 1: Income type (`Salary | Business Income | Freelance | Mixed`)
  - Step 2: Income range (`0–500k | 500k–2M | 2M–5M | 5M+ XAF`)
  - Saves onboarding data into `user_profiles.metadata` in Supabase.
- **Tax Dashboard**:
  - Shows “Your tax profile” summary.
  - Shows applicable taxes grouped into:
    - Applies
    - May apply later
    - Does not apply
  - Tax applicability decided by a rules engine (IRPP, CNPS, IMF, VAT, IS, Property, Patente).
  - Actions: **See Estimation**, **Save PDF**, **Set Reminders** (placeholder).
- **Tax Estimation**:
  - Calculates from gross monthly salary:
    - IRPP using progressive monthly brackets
    - CNPS = 4.2% employee portion
    - Net salary = gross − IRPP − CNPS
  - Shows breakdown and checklist.
  - Actions: Set Reminders, Save PDF, Share (PDF).
  - Saves an estimate record to `tax_estimates` (linked to a `taxes` table row for `IRPP`).
- **PDF report**:
  - Generates a multi-page PDF containing:
    - Profile summary
    - Applicable taxes
    - Estimation breakdown
    - Checklist
    - Disclaimer
  - Exports via “save to device” and “share”.

## Target: React Web App (requirements)
### Platforms
- **Mobile web**: 360–430px width, touch-first, stacked layout.
- **Tablet**: 768–1024px, adaptive two-column where appropriate.
- **Desktop**: ≥ 1024px, app shell with persistent navigation, wider cards, denser data presentation.

### UX/UI goals (“better UI”)
- **Modern landing page** (public) with clear CTA and trust messaging.
- **Consistent design system** (typography, spacing, colors, radii, shadows).
- **Fast perceived performance** (skeletons for dashboard/estimation, optimistic UI where safe).
- **Accessible** (keyboard navigation, focus states, semantic headings, sufficient contrast).
- **Polished motion** (subtle transitions; avoid jank on mobile).

### Non-goals (for migration phase)
- Rebuilding mobile-native features (push notifications, native share sheets) beyond what browsers support.
- Complex reminders system (can remain placeholder initially).

## Web information architecture (pages/routes)
Public:
- `/` **Landing**
- `/pricing` (optional stub, can be “Coming soon”)
- `/privacy` and `/terms` (required for auth + trust; can be simple pages)

Auth + onboarding:
- `/auth` Sign in / Sign up
- `/onboarding/identity` Identity selection
- `/onboarding` Multi-step onboarding (income type/range)

App:
- `/app` (redirect → `/app/dashboard`)
- `/app/dashboard` Tax dashboard
- `/app/estimation` Tax estimation (uses saved profile + user-input gross)
- `/app/history` (optional) Estimation history (reads `tax_estimates`)
- `/app/settings` (optional) Account + profile (sign out, reset onboarding)

Routing rules:
- If **not authenticated** → allow public pages; `/app/*` redirects to `/auth`.
- If authenticated but **onboarding incomplete** → redirect to onboarding routes.
- If authenticated and onboarding complete → allow `/app/*`.

## Core modules (React)
### 1) Landing Page Module
**Goal**: Convert visitors into signups and explain the product.

Sections:
- Hero: “Understand, calculate, and manage your taxes in Cameroon” + CTA buttons.
- Problem/solution bullets (clarity, estimation, export/share report).
- Feature cards:
  - Personalized tax applicability
  - Take-home pay estimation (IRPP + CNPS)
  - PDF report export/share
  - Secure sign-in (Supabase)
- “How it works” (3 steps): Create account → Answer questions → Get dashboard + report.
- Trust: disclaimer (“informational, not tax advice”), data/security, links to privacy/terms.
- Footer: product links + socials placeholders.

### 2) Auth Module (Supabase)
Features:
- Email/password sign up & sign in.
- Error mapping (invalid credentials, network errors).
- Loading states.
- Pending email confirmation state after signup when session is null.

### 3) Onboarding Module
**Data captured** (matching Flutter):
- `identity` (e.g., Individual / Business / Mixed — see `IdentitySelectionScreen` logic)
- `income_type` (Salary/Business Income/Freelance/Mixed)
- `income_range` (range strings)
- `vat_registered` (not fully surfaced in UI today; keep as optional toggle if needed)

Behavior:
- Persist onboarding data to Supabase `user_profiles.metadata`.
- Allow users to go back and edit until completion.
- Completion flips “onboardingComplete” and routes to dashboard.

### 4) Tax Decision Engine Module
**Input**: user profile (identity + income type + VAT registered).
**Output**: list of tax cards grouped into the three dashboard sections.

Taxes considered (from Flutter rules engine):
- IRPP, CNPS, IMF, VAT/TVA, IS, Property Tax, Patente.

Implementation notes:
- Port the rule logic 1:1 first (to reduce migration risk), then refine copy/wording in UI.
- Provide human-readable “learn more” copy per tax card.

### 5) Tax Estimation Module
User actions:
- Enter monthly gross salary (XAF).
- View:
  - Take-home pay (net salary)
  - IRPP amount
  - CNPS amount
  - Total deductions
  - Ratios/progress indicators
- Checklist (toggleable, local state; optionally persist later).

Calculations (match Flutter):
- IRPP brackets (monthly):
  - ≤ 62,000: 0%
  - 62,001–166,667: 10%
  - 166,668–250,000: 15%
  - 250,001–416,667: 25%
  - > 416,667: 35%
- CNPS employee portion: 4.2% of gross
- Net = gross − IRPP − CNPS

### 6) PDF Report Module (Web)
Generate PDF in-browser and allow:
- Download to device
- Share (Web Share API where supported; fallback to download link)

PDF contents (match Flutter structure):
1. User profile summary
2. Applicable taxes (with category labels)
3. Estimation breakdown (gross, IRPP, CNPS, total deductions, take-home)
4. Checklist
5. Disclaimer

### 7) Data persistence module (Supabase)
Tables used by Flutter code:
- `user_profiles` (expects `id` = auth user id; `metadata` JSONB)
- `taxes` (lookup by `code`, e.g. `IRPP`)
- `tax_estimates` (insert new estimates; read list for history)

Required operations:
- Fetch profile
- Update profile
- Insert estimate
- List estimate history

## Proposed React tech stack (recommended)
- **React + TypeScript**
- **Vite** (fast dev/build) or **Next.js** (if SEO-heavy landing + routing; optional)
- **React Router** (if using Vite)
- **UI**: Tailwind CSS + shadcn/ui (clean, modern, responsive)  
  Alternative: MUI if you prefer component-heavy, fast iteration.
- **State**:
  - Server state: TanStack Query
  - Client state: Zustand (or Context for small state)
- **Forms**: React Hook Form + Zod validation
- **Supabase**: `@supabase/supabase-js`
- **PDF**: `pdf-lib` or `@react-pdf/renderer` (choose based on fidelity vs ease)

## Component-level UI plan (desktop + responsive)
App Shell:
- Desktop: left sidebar (logo, nav: Dashboard, Estimation, History, Settings), top-right user menu.
- Mobile: top app bar + bottom nav (Dashboard, Estimation, History).

Design tokens:
- Primary: purple (brand), Accent: orange (CTA)
- Surface: light gray background, white cards

Reusable components:
- `Button`, `Card`, `Badge`, `Alert`, `Skeleton`, `EmptyState`
- `MoneyInput` (XAF formatting)
- `TaxCard` (expand/collapse “Learn more”)
- `ProgressBar` (deduction ratios)
- `PdfExportDialog` (download/share)

## Migration strategy
Keep business logic stable:
- Port the tax calculator and decision engine first (unit-tested).
- Port Supabase schema expectations (profile + estimates).
- Then implement UI and routes.

## Implementation task breakdown (React)
### Phase 0 — Repository + tooling
- **Create web workspace**: `web/` folder (React app lives here)
- **Choose stack**: Vite+React+TS, Tailwind, shadcn/ui, React Router
- **CI**: add basic lint/test/build workflow (optional initially)

### Phase 1 — Design + routing skeleton
- **Design system**: theme tokens (purple/orange), typography scale, spacing, shadows
- **Routing**:
  - Public layout (landing, terms, privacy)
  - Auth layout
  - App layout with route guards
- **Responsive shell**: sidebar (desktop) + bottom nav (mobile)

### Phase 2 — Supabase integration
- **Environment**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- **Auth**:
  - Sign in/up
  - Session restore
  - Sign out
- **Profile service**:
  - `getUserProfile()`
  - `updateUserProfile(metadata)`
- **Guards**:
  - `requireAuth`
  - `requireOnboardingComplete`

### Phase 3 — Onboarding flow
- **Identity selection page**
- **Step flow page** (income type, income range)
- **Persist metadata** into `user_profiles.metadata`
- **Completion** routes to `/app/dashboard`

### Phase 4 — Tax rules + dashboard
- **Port decision engine** (IRPP/CNPS/IMF/VAT/IS/Property/Patente)
- **Dashboard page**:
  - Profile summary card
  - Grouped tax cards (applies/may/not)
  - Actions (Estimation, PDF, Reminders placeholder)
- **Loading/error states**: skeleton + retry

### Phase 5 — Estimation
- **Port calculator**: IRPP brackets + CNPS + net salary
- **Estimation page**:
  - Gross input (XAF)
  - Hero take-home card
  - Breakdown rows + ratio bars
  - Checklist interactions
- **Save estimate**:
  - Resolve `taxes.id` for `IRPP` (or hardcode mapping if you control schema)
  - Insert row into `tax_estimates`

### Phase 6 — PDF export/share
- **PDF generator** (in-browser):
  - Use current profile + decisions + estimate values
- **Download**:
  - Generate blob → download
- **Share**:
  - Web Share API with file if supported
  - Fallback to download + copy link messaging

### Phase 7 — Landing page
- **Build landing** with modern sections + CTA to `/auth`
- **Add legal pages**: `/privacy`, `/terms`
- **SEO basics**: title/meta, OpenGraph, favicon

### Phase 8 — Quality, testing, release
- **Unit tests**:
  - Tax calculator
  - Decision engine
- **Integration tests** (optional):
  - Auth + onboarding happy path
- **Analytics** (optional): simple pageview events
- **Deploy**:
  - Vercel/Netlify/Cloudflare Pages
  - Configure environment variables

## Deliverables
- React web app with:
  - Landing page
  - Supabase auth
  - Onboarding
  - Tax dashboard
  - Estimation
  - PDF export/share
  - Responsive + desktop layouts

## Open questions (capture for later)
- Final list of identities on Identity Selection screen (Individual/Business/Mixed wording).
- Whether `vat_registered` should be a user-controlled setting during onboarding.
- Confirm Supabase schema (columns, RLS policies, `metadata` JSONB existence).

