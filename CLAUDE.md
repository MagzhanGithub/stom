# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (http://localhost:3000)
npm run build      # Production build
npm run lint       # ESLint via next lint
npm run type-check # tsc --noEmit (no test suite exists)
```

No test suite is configured. Type-check before committing. ESLint runs during `next build` — unused imports fail the build.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind CSS v3 · Framer Motion v11 · Lucide React · jose (JWT)

## Architecture

### Data layer — single source of truth

All clinic data lives in `lib/`:
- `lib/config.ts` — clinic name, phone, address, hours, coordinates, `mapEmbedSrc` (Google Maps embed URL using plus code). **Never hardcode clinic data in components.**
- `lib/services.ts` — 7 service categories with KZT price items; `getServiceBySlug()` for dynamic pages
- `lib/types.ts` — all shared TypeScript interfaces including `ClinicConfig`
- `lib/faq.ts`, `lib/reviews.ts` — static content arrays
- `lib/animations.ts` — shared Framer Motion `Variants` (`fadeUp`, `staggerContainer`, `viewportOnce`, etc.)
- `lib/utils.ts` — `cn()` (clsx + tailwind-merge), `formatPrice()`

### CTA / booking modal coordination

Cross-component CTA wiring uses a custom DOM event — no prop drilling, no global state:

```ts
// Any CTA button fires:
window.dispatchEvent(new CustomEvent('open-booking-modal'))

// BookingModal listens:
window.addEventListener('open-booking-modal', handler)
```

`components/sections/CTAButton.tsx` and `components/sections/HeroBookingButton.tsx` are thin `'use client'` wrappers that fire the event, allowing parent sections to stay as Server Components.

### Booking → WhatsApp + API flow

`BookingModal` (4-step form) on submit:
1. Opens clinic WhatsApp via anchor click (more reliable than `window.open` on mobile):
```ts
const a = document.createElement('a')
a.href = waUrl   // https://wa.me/77074289598?text=...
a.target = '_blank'
document.body.appendChild(a); a.click(); document.body.removeChild(a)
```
2. POSTs booking data to `POST /api/bookings` (so admin dashboard receives it)
3. `setStep(4)` — shows success screen

`formatDate(iso)` in `BookingModal.tsx` converts `YYYY-MM-DD` → `DD.MM.YYYY` for display.

Step 2 (date selection) uses an inline calendar (not `<input type="date">`). Sundays are disabled. Saturdays only show slots up to 12:30. Past time slots are disabled when today is selected. Already-confirmed slots are fetched and disabled to prevent double-booking.

### Server vs Client components

Keep components as Server Components by default. Add `'use client'` only when needed:
- All Framer Motion consumers **must** have `'use client'` — missing it causes a React Client Manifest bundler error
- All `useState`/`useEffect`/event handler components need `'use client'`
- Extract small client leaves (e.g. `HeroBookingButton`, `CTAButton`) to avoid marking entire sections as client

### Tailwind color token rules

Colors are defined in `tailwind.config.ts` with `DEFAULT` keys. The `DEFAULT` variant generates the **unsuffixed** class:
- `brand.DEFAULT` → `bg-brand`, `text-brand`, `border-brand` (**not** `bg-brand-DEFAULT`)
- `navy.DEFAULT` → `bg-navy`, `text-navy`
- `border.DEFAULT` → `border-border`
- `cta.DEFAULT` → `bg-cta`, `text-cta`

Named variants work normally: `brand-dark`, `brand-lighter`, `navy-light`, `cta-hover`, etc.

**White text on `brand` (teal #4ddde2) fails WCAG AA** (contrast 2.1:1). Never use `text-white` on teal backgrounds. Use `text-navy` instead.

### z-index stack

`z-60` is a **custom value** defined in `tailwind.config.ts` under `extend.zIndex`. Standard Tailwind only goes to `z-50`.

| Layer | z-index |
|-------|---------|
| Header | 20 |
| Backdrop | 30 |
| Mobile nav drawer | 40 |
| Mobile bottom bar | 50 |
| Booking modal | 60 |

### Page structure

`app/page.tsx` assembles all homepage sections in order. Inner pages (`/uslugi/[slug]`, `/tseny`, `/kontakty`, `/o-nas`) each include `<BookingModal />` at the end.

`components/JsonLd.tsx` is rendered in `app/layout.tsx` and outputs LocalBusiness, FAQPage, and ServiceList JSON-LD for all pages.

### Site layout vs Admin layout

`components/layout/SiteChrome.tsx` is a `'use client'` wrapper that checks `usePathname()`. On `/admin/*` routes it renders only the children (no Header/Footer/MobileBottomBar). On all other routes it renders the full site chrome.

### Header layout

**Desktop**: logo → nav links → "Войти" link (`/admin/login`). Phone + "Записаться" were removed; they remain in `MobileBottomBar` and hero CTA only.

**Mobile**: logo → phone icon (`tel:` link) → hamburger. `MobileBottomBar` (fixed, `md:hidden`) shows WhatsApp + "Записаться". Mobile nav sidebar has a "Войти" link at the bottom.

### Admin panel (`/admin/*`)

Single-admin JWT auth via `jose`. Credentials stored in env vars `ADMIN_LOGIN` / `ADMIN_PASSWORD` (fallback hardcoded for dev). JWT secret in `JWT_SECRET`.

**Auth flow:**
- `POST /api/auth/login` — validates credentials, sets `admin_token` httpOnly cookie (8h, HS256 JWT)
- `POST /api/auth/logout` — clears the cookie, redirects to `/`
- `middleware.ts` — protects `/admin/dashboard` routes; redirects unauthenticated to `/admin/login`
- "Войти" links go directly to `/admin/login` (never to `/admin`) so the login form always shows

**Admin components** (`components/admin/`):
- `Sidebar.tsx` — dark sidebar (`bg-[#1e1f2d]`): mini calendar, quick actions grid, Избранное, user+logout. Bell icon shows red dot when there are unconfirmed bookings; clicking it opens the notification popup. On mobile: hidden by default, opens as fixed overlay with backdrop.
- `CalendarWidget.tsx` — interactive month calendar; only shows 6th row if it contains current-month days. Syncs with header date nav via `useEffect` on `selectedDate` prop.
- `DashboardHeader.tsx` — top bar with sidebar toggle (LayoutGrid icon), date navigation, День/Неделя. Shows red dot on toggle button when sidebar is closed and there are unread notifications. On mobile: abbreviated date ("16 апр"), Продать/filter/search icons hidden, "Сегодня" hidden (floating button shown instead).
- `ScheduleGrid.tsx` — time grid 09:00–19:00, 30-min slots (32px each). Hour boundaries = full solid line; half-hour boundaries = full-width dashed line. Current time: pill in left time column + black `h-px` line across staff columns. Left and right time columns use `position: sticky`. Right time column hidden on mobile (`hidden md:block`). Staff columns are dynamic (from `/api/staff`); when no staff exist, a single empty placeholder column renders via `displayStaff` fallback. Header and grid share a single `overflow-auto` scroll container; header uses `sticky top-0` so it stays visible on vertical scroll while scrolling horizontally with the grid.
- `AddStaffModal.tsx` — bottom-sheet modal, inputs: Имя + Должность, `POST /api/staff`, calls `onAdded()` on success.
- `SearchClientModal.tsx` — bottom-sheet modal, filters `bookings` prop by clientName/phone in-memory (no API call).

**Mobile sidebar toggle:** `isMobile` state (from `useEffect` + resize listener) controls whether sidebar is a flex item (desktop) or a fixed overlay (mobile).

**Mobile admin bottom bar** (fixed, `md:hidden`, `z-40`): 5 buttons — Выручка, Продажа, Фильтры, Найти клиента (opens `SearchClientModal`), Добавить (opens `AddStaffModal`).

### Booking and Staff APIs

`app/api/bookings/route.ts` — persists to **Supabase PostgreSQL** (`bookings` table). Falls back to an in-memory array only when `SUPABASE_SECRET_KEY` / `NEXT_PUBLIC_SUPABASE_URL` env vars are missing (local dev without credentials).

`app/api/staff/route.ts` — persists to **Supabase PostgreSQL** (`staff` table). In-memory fallback when Supabase absent. `GET` returns Supabase data (empty array if table empty — no hardcoded defaults). `POST` inserts a new `StaffEntry` (`id`, `name`, `role`, `createdAt`).

**Required Supabase tables:**
```sql
-- bookings table (see plan file for full schema)
-- staff table:
create table staff (
  id text primary key,
  name text not null,
  role text not null,
  "createdAt" bigint not null
);
```

**Required env vars** (Vercel + `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` — project URL (`https://<id>.supabase.co`)
- `SUPABASE_SECRET_KEY` — secret key (bypasses RLS; server-side only)

`lib/supabase.ts` — lazy singleton `getSupabase()` (avoids build-time init error when env vars are absent).

**Booking status flow:** `'new'` → `'dismissed'` (X button) or `'confirmed'` (Перейти к записи button)

- `GET /api/bookings` — returns all bookings; returns **500** on Supabase error (never returns empty array, which would clear the dashboard)
- `POST /api/bookings` — creates new booking (`BookingEntry`), status starts as `'new'`
- `PATCH /api/bookings` — updates status by `id`

**Dashboard polling:** `useEffect` polls every 3s. `shownIdsRef` (`useRef<Set<string>>`) tracks which booking IDs have already triggered a popup this session (avoids re-showing without causing re-renders).

**Notification popup** (`page.tsx`):
- Shows for `status === 'new'` bookings not yet in `shownIdsRef`
- X button → PATCH to `'dismissed'`; red dot on bell stays until confirmed
- "Перейти к записи" → PATCH to `'confirmed'`; navigates to booking date
- Position: `left: 228px` on desktop when sidebar open, else `left: 16px`
- X: always visible on mobile, hover-only on desktop (`md:opacity-0 md:group-hover:opacity-100`)

**Schedule grid** only shows `status === 'confirmed'` bookings. Unconfirmed bookings are invisible in the grid.

**Double-booking prevention:** `BookingModal` fetches `/api/bookings` on date change, disables time slots where a `'confirmed'` booking already exists for that date.

**Booking window:** clients can book up to **90 days** ahead. Calendar next-month nav is disabled once the 90-day boundary month is reached.

### Images

Real photos are in place:
- `public/images/doctors/doctor.jpg` — clinic doctor photo
- `public/images/before-after/whitening.jpg`, `veneers.jpg`, `implant.jpg` — single photo per category; the before/after slider applies a CSS sepia filter on the left ("before") half to simulate yellow→white transformation. No separate before/after image pairs needed.

### framer-motion + Next.js 14

`transpilePackages: ['framer-motion']` is set in `next.config.mjs` to fix the RSC bundler manifest error that occurs with framer-motion v11.
