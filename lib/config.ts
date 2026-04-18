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
  mapEmbedSrc:       'https://widgets.2gis.com/widget?type=firmsonmap&options=%7B%22firmIds%22%3A%5B%229570784863334398%22%5D%2C%22pos%22%3A%7B%22lat%22%3A51.143688%2C%22lon%22%3A71.455375%2C%22zoom%22%3A17%7D%2C%22transport%22%3Afalse%7D',
  foundedYear:       2015,
  patientsCount:     '3 000+',
  googleRating:      4.9,
  googleReviewsCount: 87,
  hours: [
    { days: 'Понедельник – Пятница', hours: '09:00 – 18:00' },
    { days: 'Суббота',               hours: '09:00 – 13:00' },
  ],
} satisfies ClinicConfig
