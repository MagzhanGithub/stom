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

Next.js 14 App Router · TypeScript strict · Tailwind CSS v3 · Framer Motion v11 · Lucide React

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

### Booking → WhatsApp flow

`BookingModal` (4-step form) sends booking data to the clinic's WhatsApp on submit:

```ts
// submit() builds a wa.me URL with encoded message, then:
const a = document.createElement('a')
a.href = waUrl   // https://wa.me/77074289598?text=...
a.target = '_blank'
document.body.appendChild(a)
a.click()        // anchor click is more reliable than window.open on mobile
document.body.removeChild(a)
setStep(4)       // show success screen
```

`formatDate(iso)` in `BookingModal.tsx` converts `YYYY-MM-DD` → `DD.MM.YYYY` for display.

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

### Header layout

**Desktop**: logo → nav links → phone number → "Записаться" button. No social icons.

**Mobile**: logo → phone icon (`tel:` link) → hamburger. `MobileBottomBar` (fixed, `md:hidden`) shows WhatsApp + "Записаться".

`ContactLinks` component exists but is **not** used in the header or CTA sections — it's available for other placement if needed.

### Images

Real photos are in place:
- `public/images/doctors/doctor.jpg` — clinic doctor photo
- `public/images/before-after/whitening.jpg`, `veneers.jpg`, `implant.jpg` — single photo per category; the before/after slider applies a CSS sepia filter on the left ("before") half to simulate yellow→white transformation. No separate before/after image pairs needed.

### framer-motion + Next.js 14

`transpilePackages: ['framer-motion']` is set in `next.config.mjs` to fix the RSC bundler manifest error that occurs with framer-motion v11.
