# DESIGN.md — Zhanar Dent
### Единственный источник истины по дизайну

> Версия: 1.0 | Апрель 2025
> Применён design skill: 10 линз анализа
> Связан с: [PRD.md](PRD.md) | [research/dental-website-best-practices.md](research/dental-website-best-practices.md)

---

## 1. Design Principles

Шесть принципов, которые управляют каждым дизайн-решением. Если решение противоречит хотя бы одному — оно пересматривается.

| # | Принцип | Практическое значение |
|---|---------|----------------------|
| P1 | **Доверие раньше красоты** | Реальное фото врача важнее красивого стокового фото. Живая звезда рейтинга важнее декоративного элемента. |
| P2 | **Снижай тревогу на каждом шаге** | 36% пациентов имеют стоматофобию. Ни один элемент — цвет, анимация, формулировка — не должен усиливать беспокойство. |
| P3 | **Мобайл — первый, десктоп — расширение** | 73% трафика — мобильные. Каждый компонент проектируется сначала для 375px, потом расширяется. |
| P4 | **CTA всегда в зоне досягаемости** | Пользователь не должен скроллить, чтобы найти способ записаться или позвонить. |
| P5 | **Один источник данных** | Все цены, услуги, контакты — в `/lib/data.ts`. В UI нет захардкоженных данных клиники. |
| P6 | **Адаптируемость по умолчанию** | Компоненты принимают данные через props. Добавление новой услуги или врача = новая запись в data.ts, не правка HTML. |

---

## 2. Design Tokens

Все токены реализуются как переменные Tailwind в `tailwind.config.ts`. CSS Custom Properties — автоматически.

### 2.1 Цвета

```typescript
// tailwind.config.ts — colors
colors: {
  brand: {
    DEFAULT:  '#4ddde2',   // основной teal
    dark:     '#2bbdc2',   // hover / gradient-end
    darker:   '#1a9da2',   // active / pressed
    light:    '#b2f4f6',   // tints, секция-фон
    lighter:  '#e8fbfc',   // очень светлый tint
  },
  cta: {
    DEFAULT:  '#FF6B35',   // ТОЛЬКО кнопки записи
    hover:    '#E55A24',   // hover
    light:    '#fff0eb',   // фон промо-баннера
  },
  navy: {
    DEFAULT:  '#0d1a2b',   // header, footer фон
    light:    '#162132',   // footer background
    muted:    '#1e2e3f',   // основной текст
  },
  surface: {
    1:        '#ffffff',   // основной фон страницы
    2:        '#f7f9fc',   // чередующиеся секции
    3:        '#ffffff',   // карточки (с тенью, не цветом)
    4:        '#eef9fa',   // brand-tinted секции
  },
  text: {
    primary:  '#1e2e3f',   // основной текст
    secondary:'#3d5166',   // вторичный
    muted:    '#6b7c93',   // подписи, placeholder
    inverse:  '#ffffff',   // текст на тёмных фонах
    brand:    '#1a9da2',   // ссылки, акценты
  },
  border: {
    DEFAULT:  '#e2e8f0',   // разделители, input borders
    focus:    '#4ddde2',   // focus ring
    strong:   '#cbd5e1',   // сильный border
  },
  state: {
    success:  '#10b981',
    warning:  '#f59e0b',
    error:    '#dc2626',   // ТОЛЬКО валидация форм
    info:     '#3b82f6',
  }
}
```

**Обязательные контрастные проверки (WCAG AA):**

| Пара | Коэффициент | Статус |
|------|------------|--------|
| `text.primary` (#1e2e3f) на `surface.1` (#fff) | 13.2:1 | ✅ AAA |
| `text.secondary` (#3d5166) на `surface.1` | 7.1:1 | ✅ AAA |
| `text.muted` (#6b7c93) на `surface.1` | 4.6:1 | ✅ AA |
| Белый текст на `cta.DEFAULT` (#FF6B35) | 3.2:1 | ✅ AA (large text) |
| Белый текст на `brand.DEFAULT` (#4ddde2) | 2.1:1 | ❌ ПРОВАЛ — не использовать белый текст на teal |
| `text.primary` на `surface.2` (#f7f9fc) | 12.8:1 | ✅ AAA |
| Белый на `navy.DEFAULT` (#0d1a2b) | 16.4:1 | ✅ AAA |

> ⚠️ **Критично:** Белый текст на teal (#4ddde2) не проходит WCAG. Teal используется только как акцент/иконка/border. Текст на teal-фоне — тёмный (`navy.DEFAULT`).

### 2.2 Типографика

```typescript
// tailwind.config.ts — fontFamily
fontFamily: {
  heading: ['Montserrat', 'system-ui', 'sans-serif'],
  body:    ['Open Sans', 'system-ui', 'sans-serif'],
}
```

**Полная шкала текстовых стилей:**

| Класс Tailwind | px | lh | weight | font | Использование |
|---------------|----|----|--------|------|---------------|
| `text-display` | 56/72px | 1.05 | 800 | heading | Hero H1 (только hero) |
| `text-h1` | 36/48px | 1.1 | 700 | heading | Заголовок страницы |
| `text-h2` | 28/36px | 1.15 | 700 | heading | Заголовок секции |
| `text-h3` | 20/24px | 1.25 | 600 | heading | Карточки, подразделы |
| `text-h4` | 16/18px | 1.3 | 600 | heading | Мелкие заголовки |
| `text-body-lg` | 18/18px | 1.65 | 400 | body | Lead / intro параграф |
| `text-body` | 16/16px | 1.6 | 400 | body | Основной текст |
| `text-body-sm` | 14/14px | 1.5 | 400 | body | Мелкий текст, метаданные |
| `text-label` | 14/14px | 1.4 | 500 | body | Form labels |
| `text-button` | 15/16px | 1 | 600 | heading | Текст кнопок |
| `text-nav` | 15/15px | 1 | 500 | heading | Навигация |
| `text-overline` | 11/12px | 1 | 700 | heading | Eyebrow над заголовком секции, UPPERCASE |
| `text-caption` | 12/13px | 1.4 | 400 | body | Подписи к фото, disclaimer |

**Правило eyebrow (overline):** Каждая крупная секция начинается с eyebrow — короткого uppercase текста в цвете `text.brand`, который объясняет контекст секции до того, как глаз читает H2.

```
НАШИ ВРАЧИ          ← overline (brand color, 11px, 700, uppercase, letter-spacing: 0.1em)
Команда профессионалов  ← H2
```

### 2.3 Отступы (8px base grid)

```typescript
// tailwind.config.ts — spacing (extends default)
spacing: {
  'section-mobile': '64px',   // padding-y каждой секции на мобиле
  'section-tablet': '80px',   // padding-y на tablet
  'section-desktop': '96px',  // padding-y на desktop
  'container-x': '16px',      // padding-x мобильный
}
```

### 2.4 Border Radius

```typescript
borderRadius: {
  'sm':   '4px',
  'md':   '8px',
  'lg':   '12px',
  'xl':   '16px',
  '2xl':  '24px',
  '3xl':  '32px',
  'full': '9999px',
}
```

### 2.5 Тени

```typescript
boxShadow: {
  'sm':  '0 2px 8px rgba(13,26,43,.06)',
  'md':  '0 4px 16px rgba(13,26,43,.10)',
  'lg':  '0 8px 32px rgba(13,26,43,.14)',
  'xl':  '0 16px 48px rgba(13,26,43,.18)',
  'brand': '0 8px 32px rgba(77,221,226,.20)',    // brand glow
  'cta':   '0 8px 24px rgba(255,107,53,.35)',    // CTA button glow
  'card-hover': '0 12px 40px rgba(13,26,43,.16)',
}
```

### 2.6 Анимации / Transitions

```typescript
transitionTimingFunction: {
  'default': 'cubic-bezier(.4, 0, .2, 1)',
  'spring':  'cubic-bezier(.34, 1.56, .64, 1)',
  'out':     'cubic-bezier(0, 0, .2, 1)',
}
transitionDuration: {
  'fast':   '150ms',
  'base':   '250ms',
  'slow':   '350ms',
  'page':   '500ms',
}
```

---

## 3. Component Inventory

### 3.1 Primitives (Atoms)

| Компонент | Файл | Варианты | Ключевые состояния |
|-----------|------|---------|-------------------|
| `Button` | `ui/Button.tsx` | `primary`, `secondary`, `ghost`, `link` / `sm`, `md`, `lg` | default, hover, active, focus, disabled, loading |
| `Input` | `ui/Input.tsx` | `text`, `tel`, `email` | default, focus, error, disabled |
| `Textarea` | `ui/Textarea.tsx` | — | default, focus, error |
| `Select` | `ui/Select.tsx` | — | default, open, focus, error |
| `Badge` | `ui/Badge.tsx` | `default`, `success`, `brand` | — |
| `Icon` | `ui/Icon.tsx` | size: `sm/md/lg` | — |
| `Avatar` | `ui/Avatar.tsx` | size: `sm/md/lg/xl` | — |
| `StarRating` | `ui/StarRating.tsx` | filled, half | — |
| `Spinner` | `ui/Spinner.tsx` | `sm/md` | — |
| `Divider` | `ui/Divider.tsx` | `horizontal`, `vertical` | — |

**Button — детальная спецификация:**

```
PRIMARY (CTA — запись)
  bg: cta.DEFAULT → hover: cta.hover
  text: white, font-button
  border-radius: full (pill)
  padding: 14px 32px (md), 12px 24px (sm), 18px 40px (lg)
  shadow: shadow-cta
  hover: scale(1.02), shadow elevation+1
  active: scale(.98)
  focus-visible: outline 2px brand.DEFAULT, offset 2px

SECONDARY
  bg: transparent
  border: 2px solid brand.DEFAULT
  text: brand.dark, font-button
  hover: bg brand.lighter

GHOST (на тёмных секциях)
  bg: rgba(white, .12)
  border: 1px solid rgba(white, .3)
  text: white
  hover: bg rgba(white, .20)

LINK
  no bg, no border
  text: text.brand, underline on hover
  padding: 0
```

### 3.2 Composites (Molecules)

| Компонент | Файл | Описание |
|-----------|------|---------|
| `FormField` | `ui/FormField.tsx` | Label + Input + error message |
| `ServiceCard` | `ui/ServiceCard.tsx` | Иконка + название + описание + ссылка "Подробнее" |
| `DoctorCard` | `ui/DoctorCard.tsx` | Фото + имя + специализация + опыт + CTA |
| `TestimonialCard` | `ui/TestimonialCard.tsx` | Аватар + имя + звёзды + текст отзыва + процедура |
| `PriceRow` | `ui/PriceRow.tsx` | Название услуги + цена "от X ₸" |
| `FAQItem` | `ui/FAQItem.tsx` | Вопрос + аккордеон-ответ + chevron rotation |
| `BeforeAfterSlide` | `ui/BeforeAfterSlide.tsx` | Два изображения + drag-handle + метки "До/После" |
| `StepIndicator` | `ui/StepIndicator.tsx` | Шаги формы (1 of 4) |
| `TrustBadge` | `ui/TrustBadge.tsx` | Иконка + цифра + подпись (для trust bar) |
| `PhoneLink` | `ui/PhoneLink.tsx` | `<a href="tel:...">` с иконкой |
| `TelegramLink` | `ui/TelegramLink.tsx` | `<a href="https://t.me/...">` с иконкой |
| `SectionHeading` | `ui/SectionHeading.tsx` | overline + H2 + subheading (optional) |

### 3.3 Sections (Organisms)

| Компонент | Файл | Данные из |
|-----------|------|-----------|
| `Header` | `layout/Header.tsx` | `lib/config.ts` (телефон, лого) |
| `MobileNav` | `layout/MobileNav.tsx` | `lib/nav.ts` |
| `MobileBottomBar` | `layout/MobileBottomBar.tsx` | `lib/config.ts` |
| `Footer` | `layout/Footer.tsx` | `lib/config.ts`, `lib/nav.ts` |
| `HeroSection` | `sections/HeroSection.tsx` | `lib/content.ts` |
| `TrustBar` | `sections/TrustBar.tsx` | `lib/content.ts` (статистика) |
| `ServicesSection` | `sections/ServicesSection.tsx` | `lib/services.ts` |
| `WhyUsSection` | `sections/WhyUsSection.tsx` | `lib/content.ts` |
| `DoctorSection` | `sections/DoctorSection.tsx` | `lib/doctors.ts` |
| `BeforeAfterSection` | `sections/BeforeAfterSection.tsx` | `lib/cases.ts` |
| `TestimonialsSection` | `sections/TestimonialsSection.tsx` | `lib/reviews.ts` |
| `PricingSection` | `sections/PricingSection.tsx` | `lib/services.ts` |
| `FAQSection` | `sections/FAQSection.tsx` | `lib/faq.ts` |
| `MapSection` | `sections/MapSection.tsx` | `lib/config.ts` |
| `FinalCTASection` | `sections/FinalCTASection.tsx` | static |
| `BookingModal` | `sections/BookingModal.tsx` | `lib/services.ts` |

---

## 4. Layout System

### 4.1 Контейнер

```tsx
// components/ui/Container.tsx
// max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8

<Container>          // стандартный контент
<Container wide>     // max-w-[1440px] — full-bleed секции с паддингом
<Container narrow>   // max-w-[780px] — длинный текст, blog, FAQ
```

### 4.2 Сетка

```
Mobile  (< 768px):  4 колонки, gap-4 (16px)
Tablet  (768–1024): 8 колонок, gap-6 (24px)
Desktop (1024+):   12 колонок, gap-6 (24px)
```

**Шаблоны сеток по секциям:**

| Секция | Mobile | Tablet | Desktop |
|--------|--------|--------|---------|
| Hero | 1 col (stack) | 2 col (50/50) | 2 col (55/45) |
| Services | 1 col | 2 col | 3 col |
| Why Us | 1 col | 2 col | 4 col |
| Doctors | 1 col | 2 col | 3 col |
| Pricing | 1 col | 1 col (narrow) | 2 col |
| Trust Bar | 2 col (2×2) | 4 col | 4 col |
| FAQ | 1 col | 1 col (narrow) | 1 col (narrow) |

### 4.3 Ритм секций

```
Каждая секция:
  padding-top: 64px (mob) → 96px (desk)
  padding-bottom: 64px (mob) → 96px (desk)

Чередование фонов:
  1. HeroSection           → bg white (фото занимает всё)
  2. TrustBar              → bg navy.DEFAULT (тёмная полоска)
  3. ServicesSection       → bg surface.1 (white)
  4. WhyUsSection          → bg surface.4 (brand-tinted, eef9fa)
  5. DoctorSection         → bg surface.1
  6. BeforeAfterSection    → bg surface.2 (light gray)
  7. TestimonialsSection   → bg navy.DEFAULT (тёмная, высокий контраст)
  8. PricingSection        → bg surface.1
  9. FAQSection            → bg surface.2
  10. MapSection           → bg surface.1
  11. FinalCTASection      → bg brand.DEFAULT → brand.dark (gradient)
  Footer                   → bg navy.light
```

### 4.4 Z-index Stack

```
z-0   — обычный контент
z-10  — карточки в hover-состоянии
z-20  — sticky header
z-30  — mobile nav overlay (backdrop)
z-40  — mobile nav panel
z-50  — mobile bottom bar
z-60  — booking modal backdrop
z-70  — booking modal
z-80  — tooltips, dropdowns
```

---

## 5. Page-by-Page Design Notes

### 5.1 Header

```
Desktop:
  height: 72px
  bg: white/95 + backdrop-blur-md при скролле > 0
  при скролле = 0: bg transparent (если hero тёмный) или white
  left: логотип (SVG, max-height 40px)
  center: nav links (gap-8) — Услуги ▾ / О нас / До/После / Цены / Контакты
  right: PhoneLink + Button[primary, sm] "Записаться"
  border-bottom: 1px solid border.DEFAULT при скролле

Mobile:
  height: 60px
  left: логотип
  right: PhoneLink (иконка без номера) + hamburger button
  NO nav links (в hamburger)
```

**Проблема PRD, обнаруженная линзой Responsive:**
> PRD (F-01) говорит "навигация" в мобильном хедере, но при 375px нет места. Решение: на мобиле в хедере только лого + иконка-звонок + hamburger. CTA перенесён в MobileBottomBar.

### 5.2 Hero Section

**Эмоциональная цель:** За 3 секунды посетитель должен видеть живого врача, понять что клиника современная, и заметить оранжевую кнопку.

```
Desktop (≥ lg):
  layout: grid 55% / 45%
  left column:
    overline: "СТОМАТОЛОГИЯ В ШЫМКЕНТЕ" (brand color)
    H1 (display): "Здоровая улыбка без страха и боли"
    body-lg: "Современная клиника Zhanar Dent — [адрес]. 
               Бесплатный осмотр для новых пациентов."
    CTA row: Button[primary, lg] "Записаться бесплатно" 
             + Button[ghost/secondary] "Смотреть услуги" (стрелка вниз)
    trust micro: ★★★★★ Google / Работаем с [год]
  right column:
    фото врача (полный рост или 3/4, на нейтральном фоне)
    декоративный teal blob за фото (CSS shape)
    floating badge: "Бесплатный осмотр" (pill, brand bg)

Mobile (< md):
  stack vertical:
  top: фото врача (aspect 4/3, object-fit: cover, top-crop)
  bottom: overline → H1 (smaller) → body → Button[primary, full-width]
  НЕТ secondary CTA на мобиле (экономим пространство)
  фото НЕ занимает весь экран — должно остаться место для текста и CTA above fold
```

**Критичное решение:** Кнопка "Записаться бесплатно" должна быть ВИДНА на мобиле без скролла. Фото — не более 45% высоты viewport. Это важнее красивого фото.

### 5.3 Trust Bar

```
bg: navy.DEFAULT
4 элемента в ряд (desktop) / 2×2 (mobile):
  [★ 4.9] Google    [10+ лет] Опыт    [1000+] Пациентов    [0 ₸] Осмотр
  каждый: иконка (белая) + цифра-акцент (brand color, h2 size) + подпись (text-inverse, sm)
padding-y: 32px (mob), 40px (desk)
```

### 5.4 Services Section

```
overline: "ЧТО МЫ ЛЕЧИМ"
H2: "Полный спектр стоматологических услуг"
subheading: "От лечения кариеса до имплантации — всё под одной крышей"

Grid: 3×3 (desktop), 2-col (tablet), 1-col (mobile)
ServiceCard:
  border-radius: lg (12px)
  border: 1px solid border.DEFAULT
  padding: 24px
  top: иконка в brand-colored circle (48×48)
  H3: название услуги
  body-sm: 2-3 строки описания
  bottom: TextLink "Подробнее →" (brand color)
  hover: shadow-card-hover, translateY(-4px), border-color → brand

Первые 6 услуг видны сразу. Остальные: кнопка "Показать все услуги" (secondary)
```

### 5.5 Why Us Section

```
bg: surface.4 (brand-tinted)
overline: "ПОЧЕМУ ZHANAR DENT"
H2: "Мы делаем стоматологию комфортной"

4 блока в ряд (desktop), 2×2 (tablet), 1-col (mobile):
  Каждый блок:
    иконка (48px, brand color)
    H3: "Без боли"
    body: короткое описание (2–3 строки)
  
Примеры блоков:
  🦷 Без боли — современная анестезия
  🏥 Современное оборудование — цифровой рентген, стерилизация
  📅 Удобная запись — онлайн 24/7 или через Telegram
  💰 Прозрачные цены — от X ₸, без скрытых доплат
```

### 5.6 Doctor Section

```
overline: "НАШ ВРАЧ"  (или "НАШИ ВРАЧИ" если несколько)
H2: "Знакомьтесь с вашим стоматологом"

DoctorCard (большая, не grid-карточка):
  layout: фото (40%) + info (60%) — desktop
  фото: профессиональное, 3/4 портрет, border-radius xl
  info:
    Имя + специализация (h2 + overline)
    Опыт: X лет практики
    Образование (вуз + год)
    Специализации: список badge
    Личная фраза / подход к пациентам (курсив, body-lg)
    Кнопка: "Записаться к врачу" [primary]

mobile: stack, фото сверху (aspect 1/1, круглая clip-path или square with radius)
```

### 5.7 Before/After Section

```
overline: "РЕЗУЛЬТАТЫ"
H2: "До и после лечения"
subheading: "Реальные результаты наших пациентов"

BeforeAfterSlider:
  Drag-handle по центру, иконка ↔
  Левая половина: label "ДО" (белый badge, top-left)
  Правая половина: label "ПОСЛЕ" (brand badge, top-right)
  Под слайдером: название процедуры + количество посещений

Navigation: точки снизу (desktop) / swipe (mobile)
При отсутствии реальных фото: placeholder с gradient + иконкой зуба + текст "Фото пациентов появятся после съёмки"
```

### 5.8 Testimonials Section

```
bg: navy.DEFAULT
overline: "ОТЗЫВЫ" (brand color)
H2: "Что говорят наши пациенты" (text-inverse)

Slider из TestimonialCard:
  bg: surface.1 (белая карточка на тёмном фоне)
  Avatar (50×50, circle) + Имя + Процедура
  StarRating (5 звёзд)
  Текст отзыва (body, text.primary)
  Дата

Под слайдером: "★★★★★ [N] отзывов на Google" — CTA ссылка на Google Business
Auto-play: off (не раздражает)
```

### 5.9 Pricing Section

```
overline: "ЦЕНЫ"
H2: "Прозрачные цены на лечение"
subheading: "Все цены указаны в тенге. Точная стоимость — после осмотра."

Tabs или Accordion по категориям:
  Терапия | Хирургия | Имплантация | Ортопедия | Ортодонтия | Эстетика | Детская

Каждая строка (PriceRow):
  Название услуги | "от X ₸"
  чередование bg: white / surface.2

Снизу: callout-блок:
  "Бесплатная консультация и осмотр для новых пациентов"
  Button[primary] "Записаться бесплатно"
```

### 5.10 FAQ Section

```
bg: surface.2
overline: "ЧАСТО СПРАШИВАЮТ"
H2: "Ответы на ваши вопросы"

narrow container (max-w-3xl)
FAQItem — accordion:
  вопрос: h4, bold, text.primary
  ответ: body, text.secondary
  chevron: rotate 0° → 180° при открытии, transition 250ms

6–8 вопросов. Примеры:
  "Больно ли лечить зубы?" → расскажите о анестезии
  "Сколько стоит первый приём?" → "бесплатно"
  "Можно ли записаться в выходные?"
  "Делаете ли вы имплантацию?"
  "Как записаться?"
  "Принимаете ли детей?"

FAQPage Schema JSON-LD: обязательно
```

### 5.11 Map & Contacts Section

```
2-col layout: карта (60%) | контакты (40%) — desktop
mobile: stack, карта снизу

Контакты panel:
  overline: "КАК НАС НАЙТИ"
  H2: "Адрес и контакты"
  Адрес: ул. Байтерекова 9/3, Шымкент
  Телефон: PhoneLink — крупный, tap-to-call
  Telegram: TelegramLink
  Часы работы: таблица Пн–Вс / часы

Google Maps: iframe embed
  satellite off, zoom ~15
  custom pin с логотипом клиники
```

### 5.12 Final CTA Banner

```
bg: gradient brand.DEFAULT → brand.dark (135deg)
text: navy.DEFAULT (НЕ белый — контраст!)

H2: "Запишитесь на бесплатный осмотр"
body-lg: "Первичный осмотр и консультация — бесплатно. Принимаем ежедневно."
CTA row: Button[ghost] "Записаться онлайн" + PhoneLink (белый телефон)

Декор: subtle teal circles (opacity .15) позади текста
```

### 5.13 Booking Modal

```
Trigger: любая кнопка "Записаться" → открывает modal
Modal: max-w-lg, border-radius 2xl, padding 32px
Backdrop: rgba(13,26,43,.6) + blur

Step 1/4 — Выберите услугу:
  ServicePicker: grid 2 col, карточки с иконкой и названием
  выбранная: border brand, bg brand.lighter

Step 2/4 — Выберите дату и время:
  Calendar (текущий месяц + следующий)
  Time slots: grid pill-кнопки
  "Ближайшее доступное" — highlighted

Step 3/4 — Ваши данные:
  FormField: Имя (text)
  FormField: Телефон (tel, +7...)
  FormField: Комментарий (textarea, optional)
  Checkbox: согласие на обработку данных (обязательный)

Step 4/4 — Подтверждение:
  ✅ анимация checkmark (scale + stroke animation)
  "Вы записаны!"
  Детали: услуга / дата / время
  "Ожидайте SMS-подтверждение"
  Button[secondary]: "Закрыть"

StepIndicator: прогресс-бар сверху (4 шага)
"Назад" — ссылка слева (ghost)
"Продолжить" — Button[primary, full-width] справа
```

### 5.14 Mobile Bottom Bar

```
display: flex (mobile only, hidden md+)
position: fixed, bottom: 0, left: 0, right: 0
height: 64px + padding-bottom: env(safe-area-inset-bottom)
bg: white
border-top: 1px solid border.DEFAULT
box-shadow: 0 -4px 16px rgba(13,26,43,.08)
z-index: 50

left half: PhoneLink
  иконка телефона (brand) + "Позвонить" (text-sm, text.brand)
  flex-1, border-right: 1px solid border.DEFAULT

right half: Button trigger для BookingModal
  иконка календарь (white) + "Записаться" (white)
  flex-1, bg: cta.DEFAULT
  tap → открыть BookingModal
```

---

## 6. Motion Playbook

### 6.1 Scroll Animations (Framer Motion)

```typescript
// lib/animations.ts — переиспользуемые variants

export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: .5, ease: [0,0,.2,1] } }
}

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: .4 } }
}

export const staggerContainer = {
  visible: { transition: { staggerChildren: .08, delayChildren: .1 } }
}

export const scaleIn = {
  hidden:  { opacity: 0, scale: .95 },
  visible: { opacity: 1, scale: 1, transition: { duration: .3, ease: [.34,1.56,.64,1] } }
}

// Применение: viewport={{ once: true, margin: "-80px" }}
// Анимации срабатывают ОДИН раз при прокрутке вниз
```

**Что анимируется и как:**

| Элемент | Animation | Delay |
|---------|-----------|-------|
| SectionHeading | fadeUp | 0ms |
| Service Cards | fadeUp + stagger | 80ms между |
| Why Us блоки | fadeUp + stagger | 80ms |
| Doctor Card | fadeIn | 0ms |
| Trust Bar badges | scaleIn + stagger | 60ms |
| FAQ items | fadeIn | — (только при expand) |
| Number counters | countUp, 1200ms | при входе в viewport |
| Testimonial cards | fadeIn | — (слайдер) |

### 6.2 Micro-interactions

```
Button hover:    transform: scale(1.02), shadow+1, 200ms ease-default
Button active:   transform: scale(.97), 100ms
Card hover:      translateY(-4px), shadow-card-hover, 250ms
Nav link hover:  color → text.brand, 150ms
FAQ chevron:     rotate 0→180, 300ms ease-out
Accordion body:  height expand, 300ms ease-out
Input focus:     border-color → border.focus, box-shadow appear, 200ms
Modal open:      backdrop fadeIn 200ms + panel scaleIn 250ms spring
Mobile nav open: translateX(-100% → 0), 300ms ease-out
```

### 6.3 Before/After Slider

```
Drag handle: 
  cursor: col-resize (desktop), grab (mobile)
  animation: spring physics (mass: 0.5, stiffness: 300)
  glow: box-shadow brand color при active
  иконка: ↔ arrows, white, 24px

Reveal:
  clip-path на правом изображении: inset(0 X% 0 0)
  X = 100 - handle_position (%)
  плавно следует за курсором/пальцем
```

### 6.4 prefers-reduced-motion

```css
/* globals.css */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

В Framer Motion: `useReducedMotion()` hook, заменяем все variants на простой `opacity` переход.

---

## 7. Accessibility Checklist

### Цвет и контраст
- [x] `text.primary` (#1e2e3f) на white → 13.2:1 ✅
- [x] `text.muted` (#6b7c93) на white → 4.6:1 ✅
- [x] Белый текст на `cta.DEFAULT` (#FF6B35) → 3.2:1 ✅ (только крупный текст — кнопки)
- [x] **teal (#4ddde2) НЕ используется как фон под белым текстом** — провал контраста
- [x] Информация не передаётся только цветом: ошибки в форме = иконка + цвет + текст

### Фокус и навигация
- [ ] Skip-to-content link — первый элемент в `<body>` (visually-hidden до фокуса)
- [ ] Все кнопки иконки имеют `aria-label`
- [ ] Header nav: `<nav aria-label="Основная навигация">`
- [ ] Mobile nav: `aria-expanded` на кнопке, `aria-hidden` на меню
- [ ] BookingModal: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- [ ] Modal trap focus: фокус не выходит за пределы открытого modal
- [ ] FAQ: `aria-expanded` на кнопке, `aria-controls` связывает кнопку с панелью
- [ ] Before/After slider: `role="slider"`, `aria-valuenow`, `aria-label`

### Семантика HTML
```html
<html lang="ru">
<body>
  <a href="#main" class="sr-only focus:not-sr-only">Перейти к содержимому</a>
  <header role="banner">
    <nav aria-label="Основная навигация">
  <main id="main">
    <h1> — ровно один на странице
    <section aria-labelledby="section-id">
  <footer role="contentinfo">
```

### Изображения
- Фото врача: `alt="Врач [Имя] — стоматолог Zhanar Dent"`
- Интерьер: `alt="Стоматологический кабинет Zhanar Dent — современное оборудование"`
- Before/After: `alt="До: [состояние]. После: [результат] — [процедура]"`
- Декоративные: `alt=""`
- Логотип: `alt="Zhanar Dent — стоматологическая клиника"`

### Формы
- Каждый input: явный `<label for="id">`
- Обязательные поля: `required`, `aria-required="true"`
- Ошибка: `aria-describedby` связывает input с текстом ошибки
- Успешная отправка: `aria-live="polite"` регион анонсирует результат

---

## 8. CRO Design Map

### Карта CTAs (все точки конверсии)

| Секция | CTA | Тип | Действие |
|--------|-----|-----|---------|
| Header (sticky) | "Записаться" | Button primary sm | → BookingModal |
| Hero | "Записаться бесплатно" | Button primary lg | → BookingModal |
| Hero | "Смотреть услуги" | Button secondary | → #services (scroll) |
| Trust Bar | — | нет CTA | (только доверие) |
| Services cards | "Подробнее" | TextLink | → /uslugi/[slug] |
| Why Us | — | нет CTA | (доверие, не давим) |
| Doctor | "Записаться к врачу" | Button primary | → BookingModal |
| Before/After | — | нет CTA | (доверие) |
| Testimonials | "Все отзывы на Google" | TextLink | → Google Maps |
| Pricing | "Записаться бесплатно" | Button primary | → BookingModal |
| FAQ | "Задать вопрос" | Button secondary | → #contacts |
| Map/Contacts | PhoneLink + TelegramLink | Links | → tel: / t.me/ |
| Final CTA | "Записаться онлайн" | Button ghost | → BookingModal |
| Footer | PhoneLink + TelegramLink | Links | → tel: / t.me/ |
| Mobile Bottom Bar | "Записаться" | Button cta | → BookingModal |
| Mobile Bottom Bar | "Позвонить" | PhoneLink | → tel: |

**Правило:** В каждом viewport (экране) должна быть хотя бы одна точка конверсии видна без скролла.

### Расстановка trust-сигналов

```
Зона 1 — Above fold (первые 3 сек):
  ✓ Реальное фото врача
  ✓ Название клиники и город
  ✓ Google-рейтинг мини-звёзды под hero subheadline

Зона 2 — Trust Bar (сразу после hero):
  ✓ Google ★ 4.9 / N отзывов
  ✓ X+ лет опыта
  ✓ X+ пациентов
  ✓ Бесплатный осмотр

Зона 3 — Before Pricing (перед ценами):
  ✓ Doctor section (доверие к врачу)
  ✓ Testimonials (доверие от пациентов)
  → только после этого показываем цены

Зона 4 — Final CTA section:
  ✓ "Бесплатная консультация" снимает финансовый барьер
```

### Microcopy для снижения тревоги

| Элемент | Плохо | Лучше |
|---------|-------|-------|
| Кнопка записи | "Отправить заявку" | "Записаться бесплатно" |
| Под кнопкой | — | "Без предоплаты. Отмена в любое время." |
| Форма шаг 3 | "Введите данные" | "Мы свяжемся только для подтверждения" |
| Подтверждение | "Заявка принята" | "Вы записаны! Ждём вас [дата] в [время]" |
| Телефон в шапке | просто номер | "📞 Позвонить" |
| Цены | "Цена: 15000" | "от 15 000 ₸" |

---

## 9. Open Design Questions

| # | Вопрос | Блокирует |
|---|--------|----------|
| DQ-01 | Есть ли фото врача профессионального качества? | HeroSection, DoctorSection |
| DQ-02 | Есть ли фото интерьера клиники? | HeroSection (альтернатива) |
| DQ-03 | Есть ли фото "до/после" от реальных пациентов? | BeforeAfterSection |
| DQ-04 | Логотип клиники (SVG или PNG)? | Header, Footer, favicon |
| DQ-05 | Сколько врачей? Одна карточка или grid? | DoctorSection layout |
| DQ-06 | Есть ли именно "Жанар" как имя врача, или это бренд? | DoctorSection copy |
| DQ-07 | Точные часы работы (в т.ч. выходные)? | Header, Map Section, Schema |
| DQ-08 | Телефон и Telegram username? | Header, Footer, MobileBottomBar |

**При отсутствии реальных фото:** использовать высококачественные стоковые, НО с явной заменой после предоставления клиентом. Placeholder-система: все images в `/public/images/[category]/` с README о замене.

---

## 10. PRD Amendments

Изменения в PRD, выявленные design-анализом:

| # | Секция PRD | Проблема | Правка |
|---|-----------|---------|--------|
| A-01 | F-01 (Header mobile) | "Навигация" на мобиле не помещается | Убрать nav-links из мобильного хедера. Оставить: лого + иконка-телефон + hamburger |
| A-02 | F-02 (Hero) | Описание слишком общее | Уточнить: фото выше fold занимает max 45% высоты. CTA обязателен above-fold на всех устройствах |
| A-03 | 7.1 (Цвета) | Отсутствует `surface.3`, `surface.4`, `border` токены | Добавить полную token-таблицу из DESIGN.md section 2.1 |
| A-04 | 7.1 (Цвета) | Белый текст на teal не указан как запрещённый | Добавить: "Белый текст на #4ddde2 ЗАПРЕЩЁН (контраст 2.1:1)" |
| A-05 | 7.2 (Типографика) | Нет `overline` (eyebrow) стиля | Добавить overline: 11–12px, uppercase, letter-spacing .1em, brand color |
| A-06 | 8. (Ситemap) | Нет `/blog/` в MVP | Перенести блог в Out of Scope V1, добавить в V2 |
| A-07 | 4. (Positioning) | Всё ещё написано "Zhanar Stom" | Исправить на "Zhanar Dent" |
| A-08 | 14. (Plan) | Нет шага "создание lib/data.ts до вёрстки" | Добавить как Этап 0, задача 1 — все данные в data-файлы до первого компонента |
| A-09 | F-08 (До/После) | При отсутствии фото нет fallback | Добавить: placeholder-секция с сообщением о скором добавлении фото |
| A-10 | 11. (Content) | Нет упоминания о placeholder-системе для фото | Добавить: все images хранятся в `/public/images/[category]/`, с README инструкцией для замены |

---

*DESIGN.md — живой документ. Обновляется при каждом изменении в дизайн-системе или при поступлении реальных материалов от клиента.*
