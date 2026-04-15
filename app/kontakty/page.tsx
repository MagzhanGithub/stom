import type { Metadata } from 'next'
import MapSection        from '@/components/sections/MapSection'
import BookingModal      from '@/components/sections/BookingModal'
import { clinic }        from '@/lib/config'

export const metadata: Metadata = {
  title:       `Контакты — ${clinic.name}`,
  description: `Адрес: ${clinic.fullAddress}. Телефон: ${clinic.phone}. Режим работы: ежедневно. Запись онлайн.`,
  alternates:  { canonical: '/kontakty' },
  openGraph: {
    title:       `Контакты — ${clinic.name}`,
    description: `Адрес и режим работы стоматологии ${clinic.name} в ${clinic.city}`,
    url:         '/kontakty',
  },
}

export default function KontaktyPage() {
  return (
    <>
      <div className="pt-8 bg-surface-2">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="overline text-brand-dark mb-2">АДРЕС</p>
          <h1 className="text-h1 font-heading text-navy">Контакты</h1>
          <p className="text-body-lg text-text-secondary mt-3">{clinic.fullAddress}</p>
        </div>
      </div>
      <MapSection />
      <BookingModal />
    </>
  )
}
