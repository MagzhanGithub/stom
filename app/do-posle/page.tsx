import type { Metadata } from 'next'
import BeforeAfterSection from '@/components/sections/BeforeAfterSection'
import FinalCTASection from '@/components/sections/FinalCTASection'
import AltegioBookingModal from '@/components/sections/AltegioBookingModal'
import { clinic } from '@/lib/config'

export const metadata: Metadata = {
  title: `До и после лечения — ${clinic.name}`,
  description: `Фотографии результатов лечения зубов в ${clinic.city}: отбеливание, виниры, имплантация. Убедитесь в качестве работ.`,
  alternates: { canonical: '/do-posle' },
}

export default function DoPoslePage() {
  return (
    <>
      <div className="pt-8 bg-surface-2">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="overline text-brand-dark mb-2">НАШИ РАБОТЫ</p>
          <h1 className="text-h1 font-heading text-navy">До и после лечения</h1>
          <p className="text-body-lg text-text-secondary mt-3 max-w-xl mx-auto">
            Реальные результаты наших пациентов. Перетащите разделитель, чтобы сравнить.
          </p>
        </div>
      </div>
      <BeforeAfterSection />
      <FinalCTASection />
      <AltegioBookingModal />
    </>
  )
}
