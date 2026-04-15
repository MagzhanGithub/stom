import type { Metadata, Viewport } from 'next'
import { Montserrat, Open_Sans } from 'next/font/google'
import './globals.css'
import JsonLd from '@/components/JsonLd'
import SiteChrome from '@/components/layout/SiteChrome'
import { clinic } from '@/lib/config'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const openSans = Open_Sans({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://zhanar-dent.kz'), // TODO: replace with real domain
  title: {
    default: `${clinic.name} — ${clinic.tagline} в ${clinic.city}`,
    template: `%s | ${clinic.name}`,
  },
  description:
    `Стоматологическая клиника ${clinic.name} в ${clinic.city}. Лечение зубов, имплантация, ортодонтия, отбеливание. Бесплатный первичный осмотр. Запись онлайн 24/7.`,
  keywords: [
    'стоматология Шымкент',
    'стоматолог Шымкент',
    'зубной врач Шымкент',
    'имплантация зубов Шымкент',
    'лечение зубов Шымкент',
    'Zhanar Dent',
  ],
  openGraph: {
    type: 'website',
    locale: 'ru_KZ',
    siteName: clinic.name,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#4ddde2',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${montserrat.variable} ${openSans.variable}`}>
      <body>
        <JsonLd />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
