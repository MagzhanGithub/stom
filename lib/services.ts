import type { Service } from './types'

export const services: Service[] = [
  {
    id: 'therapy',
    slug: 'terapiya',
    category: 'therapy',
    title: 'Терапевтическая стоматология',
    description: 'Лечение кариеса, пульпита и восстановление зуба современными материалами',
    icon: 'Stethoscope',
    priceFrom: 9000,
    items: [
      { name: 'Первичная консультация',               priceFrom: 0 },
      { name: 'Пломба (1 поверхность)',               priceFrom: 9000,  priceTo: 12000 },
      { name: 'Пломба (2–3 поверхности)',             priceFrom: 13000, priceTo: 18000 },
      { name: 'Лечение пульпита (1 канал)',           priceFrom: 18000, priceTo: 25000 },
      { name: 'Лечение пульпита (2 канала)',          priceFrom: 28000, priceTo: 38000 },
      { name: 'Лечение пульпита (3 канала)',          priceFrom: 40000, priceTo: 55000 },
      { name: 'Профессиональная гигиена (ультразвук + Air Flow)', priceFrom: 18000, priceTo: 28000 },
      { name: 'Прицельный рентген',                  priceFrom: 2000,  priceTo: 3000 },
      { name: 'Панорамный снимок (ортопантомограмма)', priceFrom: 6000, priceTo: 8000 },
    ],
  },
  {
    id: 'surgery',
    slug: 'hirurgiya',
    category: 'surgery',
    title: 'Хирургия',
    description: 'Удаление зубов, лечение кист и другие хирургические процедуры',
    icon: 'Scissors',
    priceFrom: 8000,
    items: [
      { name: 'Удаление зуба (простое)',              priceFrom: 8000,  priceTo: 15000 },
      { name: 'Удаление зуба (сложное)',              priceFrom: 20000, priceTo: 40000 },
      { name: 'Удаление зуба мудрости',              priceFrom: 25000, priceTo: 50000 },
      { name: 'Лечение кисты',                       priceFrom: 25000, priceTo: 45000 },
    ],
  },
  {
    id: 'implant',
    slug: 'implantatsiya',
    category: 'implant',
    title: 'Имплантация',
    description: 'Восстановление утраченных зубов с помощью титановых имплантов',
    icon: 'Zap',
    priceFrom: 150000,
    popular: true,
    items: [
      { name: 'Имплант под ключ (имплант + коронка)',  priceFrom: 150000, priceTo: 280000 },
      { name: 'Тело импланта',                        priceFrom: 80000,  priceTo: 180000 },
      { name: 'Остеопластика (наращивание кости)',     priceFrom: 50000,  priceTo: 120000 },
    ],
  },
  {
    id: 'prosthetics',
    slug: 'protezirovanie',
    category: 'prosthetics',
    title: 'Протезирование',
    description: 'Коронки, мосты и съёмные протезы из современных материалов',
    icon: 'Crown',
    priceFrom: 28000,
    items: [
      { name: 'Коронка металлокерамика',              priceFrom: 28000, priceTo: 45000 },
      { name: 'Коронка цирконий',                    priceFrom: 55000, priceTo: 95000 },
      { name: 'Коронка E-max',                       priceFrom: 65000, priceTo: 110000 },
      { name: 'Съёмный протез (акрил, частичный)',   priceFrom: 60000, priceTo: 100000 },
      { name: 'Бюгельный протез',                    priceFrom: 120000, priceTo: 200000 },
    ],
  },
  {
    id: 'orthodontics',
    slug: 'ortodontiya',
    category: 'orthodontics',
    title: 'Ортодонтия',
    description: 'Исправление прикуса с помощью брекетов или прозрачных элайнеров',
    icon: 'AlignCenter',
    priceFrom: 220000,
    items: [
      { name: 'Металлические брекеты (полный курс)', priceFrom: 220000, priceTo: 350000 },
      { name: 'Керамические брекеты',               priceFrom: 320000, priceTo: 450000 },
      { name: 'Элайнеры (прозрачные капы)',          priceFrom: 450000, priceTo: 750000 },
      { name: 'Ретейнер',                            priceFrom: 15000,  priceTo: 25000 },
    ],
  },
  {
    id: 'aesthetics',
    slug: 'estetika',
    category: 'aesthetics',
    title: 'Эстетическая стоматология',
    description: 'Отбеливание зубов, виниры и улыбка вашей мечты',
    icon: 'Sparkles',
    priceFrom: 15000,
    popular: true,
    items: [
      { name: 'Отбеливание (кабинетное)',            priceFrom: 35000, priceTo: 60000 },
      { name: 'Отбеливание (домашнее, капы)',        priceFrom: 18000, priceTo: 28000 },
      { name: 'Винир (керамический, 1 зуб)',         priceFrom: 55000, priceTo: 90000 },
      { name: 'Винир (композитный, 1 зуб)',          priceFrom: 15000, priceTo: 25000 },
    ],
  },
  {
    id: 'children',
    slug: 'detskaya',
    category: 'children',
    title: 'Детская стоматология',
    description: 'Бережное лечение зубов для детей в комфортной обстановке',
    icon: 'Baby',
    priceFrom: 0,
    items: [
      { name: 'Осмотр ребёнка',                      priceFrom: 0 },
      { name: 'Пломба молочного зуба',               priceFrom: 7000,  priceTo: 12000 },
      { name: 'Удаление молочного зуба',             priceFrom: 5000,  priceTo: 10000 },
      { name: 'Серебрение / фторирование',           priceFrom: 4000,  priceTo: 7000 },
      { name: 'Герметизация фиссур',                 priceFrom: 5000,  priceTo: 8000 },
    ],
  },
]

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find(s => s.slug === slug)
}

export const featuredServices = services.slice(0, 6)
