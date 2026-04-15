import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import AltegioBookingModal from '@/components/sections/AltegioBookingModal'
import CTAButton from '@/components/sections/CTAButton'
import { services } from '@/lib/services'
import { clinic } from '@/lib/config'

export const metadata: Metadata = {
  title: `Услуги стоматологии — ${clinic.name}`,
  description: `Все виды стоматологической помощи в ${clinic.city}: терапия, хирургия, имплантация, протезирование, ортодонтия. Первичный осмотр бесплатно.`,
  alternates: { canonical: '/uslugi' },
}

export default function UslugiPage() {
  return (
    <>
      <div className="pt-8 bg-surface-2">
        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <p className="overline text-brand-dark mb-2">ВСЕ НАПРАВЛЕНИЯ</p>
          <h1 className="text-h1 font-heading text-navy">Услуги клиники</h1>
          <p className="text-body-lg text-text-secondary mt-3 max-w-xl mx-auto">
            Полный спектр стоматологических услуг. Первичный осмотр — бесплатно.
          </p>
        </div>
      </div>

      <section className="section-padding bg-white">
        <Container>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <Link
                key={service.id}
                href={`/uslugi/${service.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-border
                           bg-white hover:border-brand hover:shadow-card-hover transition-all duration-200"
              >
                <div>
                  <p className="text-caption text-text-muted uppercase tracking-wider mb-3">
                    {service.popular ? '⭐ Популярно' : 'Услуга'}
                  </p>
                  <h2 className="text-h3 font-heading text-navy mb-2 group-hover:text-brand-dark transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-body-sm text-text-secondary mb-4">{service.description}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-body-sm font-heading font-semibold text-text-brand">
                    {service.priceFrom === 0
                      ? 'Бесплатно'
                      : `от ${service.priceFrom.toLocaleString('ru')} ₸`}
                  </span>
                  <span className="flex items-center gap-1 text-brand-dark text-body-sm font-heading font-semibold
                                   group-hover:gap-2 transition-all">
                    Подробнее
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <CTAButton size="lg">Записаться на бесплатный осмотр</CTAButton>
          </div>
        </Container>
      </section>

      <AltegioBookingModal />
    </>
  )
}
