import type { Metadata } from 'next'
import PricingSection    from '@/components/sections/PricingSection'
import AltegioBookingModal from '@/components/sections/AltegioBookingModal'
import { clinic }        from '@/lib/config'

export const metadata: Metadata = {
  title:       `Цены на лечение зубов — ${clinic.name}`,
  description: `Прозрачные цены на стоматологические услуги в ${clinic.city}. Терапия, хирургия, имплантация, протезирование. Первичный осмотр бесплатно.`,
  alternates:  { canonical: '/tseny' },
  openGraph: {
    title:       `Цены — ${clinic.name}`,
    description: `Актуальные цены на все виды стоматологических услуг в ${clinic.city}`,
    url:         '/tseny',
  },
}

export default function PricingPage() {
  return (
    <>
      <div className="pt-8 bg-surface-2">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="overline text-brand-dark mb-2">ПРАЙС-ЛИСТ</p>
          <h1 className="text-h1 font-heading text-navy">
            Цены на лечение зубов
          </h1>
          <p className="text-body-lg text-text-secondary mt-3 max-w-xl mx-auto">
            Все цены в тенге. Первичный осмотр и консультация — бесплатно.
          </p>
        </div>
      </div>
      <PricingSection />
      <AltegioBookingModal />
    </>
  )
}
