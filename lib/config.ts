import type { ClinicConfig } from './types'

export const clinic = {
  name:              'Zhanar Dent',
  tagline:           'Стоматология без страха и боли',
  address:           'ул. Байтерекова 9/3',
  city:              'Шымкент',
  fullAddress:       'г. Шымкент, ул. Байтерекова 9/3',
  phone:             '+77074289598',
  phoneDisplay:      '+7 707 428-95-98',
  whatsappUrl:       'https://wa.me/77074289598',
  telegram:          'https://t.me/zhanardent', // TODO: заменить на реальный username
  telegramUsername:  '@zhanardent',             // TODO: заменить на реальный username
  telegramUrl:       'https://t.me/zhanardent', // TODO: заменить на реальный username
  siteUrl:           'https://zhanardent.kz',   // TODO: заменить на реальный домен
  coordinates:       { lat: 42.3209, lng: 69.5862 },
  mapEmbedSrc:       'https://maps.google.com/maps?q=9J9V%2B3QR+Shymkent&z=17&output=embed',
  foundedYear:       2015,
  patientsCount:     '3 000+',
  googleRating:      4.9,
  googleReviewsCount: 87,
  hours: [
    { days: 'Понедельник – Пятница', hours: '09:00 – 20:00' },
    { days: 'Суббота',               hours: '09:00 – 18:00' },
    { days: 'Воскресенье',           hours: '10:00 – 16:00' },
  ],
} satisfies ClinicConfig
