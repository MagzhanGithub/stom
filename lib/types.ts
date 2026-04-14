export interface Service {
  id: string
  slug: string
  category: ServiceCategory
  title: string
  description: string
  icon: string          // Lucide icon name
  priceFrom: number     // in KZT
  priceTo?: number
  popular?: boolean
  items?: ServiceItem[]
}

export interface ServiceItem {
  name: string
  priceFrom: number
  priceTo?: number
}

export type ServiceCategory =
  | 'therapy'
  | 'surgery'
  | 'implant'
  | 'prosthetics'
  | 'orthodontics'
  | 'aesthetics'
  | 'children'

export interface Doctor {
  id: string
  name: string
  title: string
  specializations: string[]
  experience: number   // years
  education: string
  quote: string
  image: string        // path in /public/images/doctors/
}

export interface Review {
  id: string
  name: string
  avatar?: string
  rating: 5 | 4 | 3
  text: string
  procedure: string
  date: string
}

export interface BeforeAfterCase {
  id: string
  procedure: string
  visits: number
  before: string       // path in /public/images/before-after/
  after: string
  beforeAlt: string
  afterAlt: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface ClinicConfig {
  name: string
  tagline: string
  address: string
  city: string
  fullAddress: string
  phone: string
  phoneDisplay: string
  telegram: string
  telegramUsername: string
  telegramUrl?: string
  whatsappUrl: string
  siteUrl: string
  email?: string
  coordinates: { lat: number; lng: number }
  mapEmbedSrc?: string
  hours: WorkingHours[]
  foundedYear: number
  patientsCount: string
  googleRating: number
  googleReviewsCount: number
}

export interface WorkingHours {
  days: string
  hours: string
}
