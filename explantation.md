# TaxClarity — Project explanation & defense guide

This document helps you **explain** the project and **prepare for defense-style questions** (viva, jury, stakeholder review, or technical interview). It maps **features to routes** and states where the app is deployed.

---

## Live deployment

| Item | URL |
|------|-----|
| **Production host** | [https://tax-clarity.vercel.app](https://tax-clarity.vercel.app) |
| **Main authenticated entry (dashboard)** | [https://tax-clarity.vercel.app/app/dashboard](https://tax-clarity.vercel.app/app/dashboard) |

All routes below are relative to `https://tax-clarity.vercel.app` unless noted.

---

## What the project is about

**TaxClarity (Cameroon)** is a **web application** that helps individuals orient themselves around **taxes that may apply in Cameroon**. It is **not** a replacement for an accountant or tax adviser.

**Core value:**

- Users **sign in** securely and complete a short **onboarding** (identity type, income type, approximate income band, optional VAT flag).
- The app shows a **personalized dashboard** of tax topics grouped as *likely applies*, *may apply later*, and *does not apply* based on that profile (rule-based logic, not legal advice).
- Users can run a **simplified monthly salary estimate** (illustrative **IRPP**-style brackets and **CNPS** employee share at **4.2%**), **save** results to their account, **review history**, **export a PDF report**, and **export history as CSV**.
- **Legal pages** (Terms, Privacy, Pricing) and **disclaimers** make the educational / non-advisory nature explicit.

**Target users:** Cameroon-based individuals (and similar profiles) who want **clarity and rough numbers**, not a filing system for the tax administration.

---

## Technology stack (high level)

| Layer | Choice | Role |
|-------|--------|------|
| UI | **React 19** + **Vite** | Single-page app, fast dev/build |
| Styling | **Tailwind CSS v4** | Layout, responsive design, dark mode |
| Routing | **React Router v7** | Public vs auth vs onboarding vs app areas |
| Auth & database | **Supabase** (Auth + Postgres) | Email/password login; `user_profiles`, `tax_estimates`, reference `taxes` / `tax_rules` |
| Server data fetching | **TanStack React Query** | Caching, mutations, invalidation after saves |
| Client state | **Zustand** | Session user, theme mode |
| Validation | **Zod** | e.g. auth form validation |
| PDF | **pdf-lib** | Client-side PDF generation for reports |

---

## Routes and features (defense cheat sheet)

Use this table to answer *“Where is feature X?”* or *“Show me the URL.”*

### Public (no login)

| Feature | Route | Full URL (production) |
|---------|-------|------------------------|
| Landing / marketing home | `/` | https://tax-clarity.vercel.app/ |
| Pricing & FAQ | `/pricing` | https://tax-clarity.vercel.app/pricing |
| Privacy policy | `/privacy` | https://tax-clarity.vercel.app/privacy |
| Terms of service | `/terms` | https://tax-clarity.vercel.app/terms |

### Authentication

| Feature | Route | Full URL |
|---------|-------|----------|
| Sign in / sign up (Supabase Auth) | `/auth` | https://tax-clarity.vercel.app/auth |

### Onboarding (login required, onboarding not finished)

| Feature | Route | Full URL |
|---------|-------|----------|
| Step 1 — identity (individual / business / mixed) | `/onboarding/identity` | https://tax-clarity.vercel.app/onboarding/identity |
| Step 2 — income type, range, optional VAT | `/onboarding` | https://tax-clarity.vercel.app/onboarding |

### Main app (login + onboarding complete)

| Feature | Route | Full URL |
|---------|-------|----------|
| Redirect `/app` → dashboard | `/app` | https://tax-clarity.vercel.app/app |
| **Tax dashboard** (profile summary, tax cards, PDF, reminders entry) | `/app/dashboard` | https://tax-clarity.vercel.app/app/dashboard |
| **Salary estimation** (gross input, IRPP/CNPS breakdown, checklist, save, optional note, annual ×12 view, local reminder, PDF) | `/app/estimation` | https://tax-clarity.vercel.app/app/estimation |
| **Saved estimates history** (expand row, notes, delete, CSV export, open in calculator) | `/app/history` | https://tax-clarity.vercel.app/app/history |
| **Settings** (theme, local prefs, account, export JSON, legal links, reset onboarding, support) | `/app/settings` | https://tax-clarity.vercel.app/app/settings |

### Cross-cutting UI

- **PDF export** is opened from **Dashboard** and **Estimation** via a dialog (same app shell; no separate route).
- **Reminders** are stored in **browser localStorage** (device-local), not in Supabase; banners appear on **Dashboard** and **Estimation** when due.

---

## Data & security (how to explain it briefly)

1. **User profile** — Stored in Supabase `user_profiles` (linked to `auth.users`). Onboarding answers live in **`metadata` (JSONB)** for flexibility.
2. **Saved estimates** — Table `tax_estimates`; breakdown (gross, IRPP, CNPS, net, optional user note) is stored in **`metadata`** plus numeric columns required by the schema (`base_amount`, `tax_amount`, `effective_rate`, `tax_year`, etc.).
3. **Row Level Security (RLS)** — Policies ensure users can only **select / insert / update / delete** their **own** rows (e.g. `auth.uid() = user_id` on estimates).
4. **Environment** — Supabase URL and anon key are provided via **environment variables** (e.g. `VITE_SUPABASE_*`); the anon key is public by design but RLS enforces access rules.

---

## Important limitations (say these in defense)

- Outputs are **illustrative**; real liability depends on law, facts, and professional advice.
- The **tax applicability** view is **rule-based** from onboarding inputs — it **does not** replace official guidance or a qualified adviser.
- **IRPP** estimation uses a **simplified bracket model**; real payroll and deductions can differ.
- **Reminders** are **local to the device**; clearing site data removes them.

---

## Possible defense questions & suggested answers

### General

**Q: What problem does your project solve?**  
**A:** It reduces confusion for Cameroon taxpayers by organizing *which taxes might matter* for their profile and giving a *rough* monthly take-home estimate, with exportable reports — while stating clearly that it is not professional advice.

**Q: Who are the users?**  
**A:** Individuals (employees, freelancers, small business contexts) who want orientation and numbers to discuss with an adviser or employer, not automated tax filing.

**Q: Why a web app and not a spreadsheet?**  
**A:** Persistent account, saved history, structured PDFs, consistent UX on mobile/desktop, and secure per-user data via Supabase.

### Technical

**Q: Why Supabase?**  
**A:** Managed Postgres, built-in authentication, and RLS for multi-tenant data isolation without running a custom backend for this scope.

**Q: Where is business logic?**  
**A:** Mainly in the frontend: e.g. tax grouping (`features/taxes/engine.js`), salary math (`features/estimation/calculator.js`), PDF assembly (`features/pdf/buildReport.js`). The database holds user data and reference tax rows.

**Q: How do you protect user data?**  
**A:** HTTPS, Supabase Auth, JWT-backed requests, and RLS policies so each user accesses only their profile and estimates.

**Q: Why JSON `metadata` on profiles and estimates?**  
**A:** Evolve fields (onboarding keys, notes, calculator fields) without a migration for every small change; still constrained by app code and DB types.

### Product / features

**Q: What is on the dashboard?**  
**A:** Route `/app/dashboard` — profile summary from onboarding, tax cards by category, link to estimation, PDF export, optional reminder setup, and a snapshot of the latest saved estimate when available.

**Q: How does saving an estimate work?**  
**A:** On `/app/estimation`, “Save estimate” inserts a row into `tax_estimates` with breakdown in `metadata` and summary columns; history is listed on `/app/history`.

**Q: What is the PDF for?**  
**A:** A shareable summary: profile, tax groupings, estimate and checklist (as implemented), plus disclaimer — generated client-side with pdf-lib.

**Q: Why local reminders instead of email?**  
**A:** No backend mailer is required for the MVP; reminders are a lightweight nudge stored on the device. Email could be a future integration.

### Ethics / legal

**Q: How do you avoid misleading users?**  
**A:** Terms, Privacy, Pricing, and in-app copy stress **informational** use; estimates are **not** binding; users are directed to official sources and professionals.

**Q: Is VAT calculated?**  
**A:** The app captures a **VAT registered** flag for context; detailed VAT calculation is not the core of the current salary module (answer honestly if your build does not include full VAT returns).

---

## Quick navigation map (for demos)

1. **Public site:** `/` → `/pricing`, `/privacy`, `/terms`  
2. **Auth:** `/auth`  
3. **Onboarding:** `/onboarding/identity` → `/onboarding`  
4. **App:** `/app/dashboard` → `/app/estimation` → save → `/app/history` → `/app/settings`  

**Deployed dashboard link:**  
[https://tax-clarity.vercel.app/app/dashboard](https://tax-clarity.vercel.app/app/dashboard)

---

## File name note

This file is named **`explantation.md`** as requested. The content is an **explanation** document for defense preparation; rename to `explanation.md` if your institution prefers standard spelling.
