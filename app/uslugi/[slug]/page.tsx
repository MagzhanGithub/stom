import { notFound }       from 'next/navigation'
import type { Metadata }  from 'next'
import { Check }          from 'lucide-react'
import Container          from '@/components/ui/Container'
import SectionHeading     from '@/components/ui/SectionHeading'
import CTAButton          from '@/components/sections/CTAButton'
import AltegioBookingModal from '@/components/sections/AltegioBookingModal'
import { services, getServiceBySlug } from '@/lib/services'
import { clinic }         from '@/lib/config'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getServiceBySlug(params.slug)
  if (!service) return {}
  return {
    title:       `${service.title} — ${clinic.name}`,
    description: service.description,
    alternates:  { canonical: `/uslugi/${service.slug}` },
    openGraph: {
      title:       `${service.title} — ${clinic.name}`,
      description: service.description,
      url:         `/uslugi/${service.slug}`,
    },
  }
}

export default function ServicePage({ params }: Props) {
  const service = getServiceBySlug(params.slug)
  if (!service) notFound()

  const jsonLd = {
    '@context':       'https://schema.org',
    '@type':          'MedicalProcedure',
    name:             service.title,
    description:      service.description,
    procedureType:    'https://schema.org/TherapeuticProcedure',
    followup:         'Свяжитесь с нами для консультации',
    howPerformed:     service.description,
    provider: {
      '@type':  'Dentist',
      name:     clinic.name,
      address:  clinic.fullAddress,
      telephone: clinic.phone,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-surface-4 to-surface-2">
        <Container narrow>
          <SectionHeading
            overline="УСЛУГИ"
            title={service.title}
            subtitle={service.description}
            center
          />
          <div className="flex justify-center mt-8">
            <CTAButton size="lg">Записаться на {service.title.toLowerCase()}</CTAButton>
          </div>
        </Container>
      </section>

      {/* Price list */}
      {service.items && service.items.length > 0 && (
        <section className="section-padding bg-white" aria-labelledby={`prices-${service.slug}`}>
          <Container narrow>
            <h2
              id={`prices-${service.slug}`}
              className="text-h2 font-heading text-navy mb-8 text-center"
            >
              Цены на услуги
            </h2>
            <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
              {service.items.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex items-center justify-between gap-4 px-6 py-4 ${
                    i % 2 === 0 ? 'bg-white' : 'bg-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check
                      className="w-4 h-4 flex-shrink-0 text-brand-dark"
                      aria-hidden="true"
                    />
                    <span className="text-body text-text-primary">{item.name}</span>
                  </div>
                  <span className="flex-shrink-0 text-body font-heading font-semibold text-text-brand whitespace-nowrap">
                    {item.priceFrom === 0
                      ? 'Бесплатно'
                      : `от ${item.priceFrom.toLocaleString('ru')} ₸`}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-caption text-text-muted mt-4 text-center">
              Точная стоимость определяется после бесплатного осмотра. Все цены в тенге.
            </p>
          </Container>
        </section>
      )}

      {/* CTA strip */}
      <section className="py-12 bg-surface-4">
        <Container>
          <div className="text-center">
            <p className="text-h3 font-heading text-navy mb-3">
              Бесплатная консультация для новых пациентов
            </p>
            <p className="text-body text-text-secondary mb-6">
              Узнайте точную стоимость на первичном осмотре — без предоплаты
            </p>
            <CTAButton size="lg">Записаться бесплатно</CTAButton>
          </div>
        </Container>
      </section>

      <AltegioBookingModal />
    </>
  )
}
