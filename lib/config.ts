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
  coordinates:       { lat: 51.143688, lng: 71.455375 },
  mapEmbedSrc:       'https://www.openstreetmap.org/export/embed.html?bbox=71.4520%2C51.1415%2C71.4590%2C51.1460&layer=mapnik&marker=51.143688%2C71.455375',
  map2gisUrl:        'https://2gis.kz/astana/geo/9570784863334398/71.455375,51.143688',
  foundedYear:       2015,
  patientsCount:     '3 000+',
  googleRating:      4.9,
  googleReviewsCount: 87,
  hours: [
    { days: 'Понедельник – Пятница', hours: '09:00 – 18:00' },
    { days: 'Суббота',               hours: '09:00 – 13:00' },
  ],
} satisfies ClinicConfig
