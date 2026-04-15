import type { Metadata }  from 'next'
import DoctorSection       from '@/components/sections/DoctorSection'
import WhyUsSection        from '@/components/sections/WhyUsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import FinalCTASection     from '@/components/sections/FinalCTASection'
import AltegioBookingModal from '@/components/sections/AltegioBookingModal'
import { clinic }          from '@/lib/config'

export const metadata: Metadata = {
  title:       `О клинике — ${clinic.name}`,
  description: `${clinic.name} — современная стоматологическая клиника в ${clinic.city}. Опытный врач, передовое оборудование, комфортная атмосфера.`,
  alternates:  { canonical: '/o-nas' },
  openGraph: {
    title:       `О клинике ${clinic.name}`,
    description: `Узнайте больше о нашей клинике, враче и принципах работы`,
    url:         '/o-nas',
  },
}

export default function ONasPage() {
  return (
    <>
      <div className="pt-8 bg-surface-2">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="overline text-brand-dark mb-2">О НАС</p>
          <h1 className="text-h1 font-heading text-navy">О клинике</h1>
          <p className="text-body-lg text-text-secondary mt-3 max-w-xl mx-auto">
            Современная стоматология в Шымкенте — без боли, без очередей, с заботой о каждом пациенте
          </p>
        </div>
      </div>
      <WhyUsSection />
      <DoctorSection />
      <TestimonialsSection />
      <FinalCTASection />
      <AltegioBookingModal />
    </>
  )
}
