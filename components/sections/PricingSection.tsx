'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services'
import type { ServiceCategory } from '@/lib/types'
import CTAButton from './CTAButton'

const categoryLabels: Record<ServiceCategory, string> = {
  therapy:      'Терапия',
  surgery:      'Хирургия',
  implant:      'Имплантация',
  prosthetics:  'Протезирование',
  orthodontics: 'Ортодонтия',
  aesthetics:   'Эстетика',
  children:     'Детская',
}

export default function PricingSection() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('therapy')

  const activeService = services.find(s => s.category === activeCategory)

  return (
    <section className="section-padding bg-surface-1" aria-labelledby="pricing-heading">
      <Container>
        <SectionHeading
          overline="ЦЕНЫ"
          title="Прозрачные цены на лечение"
          subtitle="Все цены в тенге. Точная стоимость — после бесплатного осмотра."
          id="pricing-heading"
          center
        />

        {/* Category tabs */}
        <div
          className="flex flex-wrap gap-2 justify-center mb-8"
          role="tablist"
          aria-label="Категории услуг"
        >
          {services.map(service => (
            <button
              key={service.category}
              role="tab"
              aria-selected={activeCategory === service.category}
              aria-controls={`pricing-panel-${service.category}`}
              onClick={() => setActiveCategory(service.category)}
              className={cn(
                'px-4 py-2 rounded-full text-body-sm font-heading font-medium transition-all duration-150',
                activeCategory === service.category
                  ? 'bg-brand text-navy shadow-brand'
                  : 'bg-surface-2 text-text-secondary hover:bg-brand-lighter hover:text-brand-dark',
              )}
            >
              {categoryLabels[service.category]}
            </button>
          ))}
        </div>

        {/* Price table */}
        {activeService?.items && (
          <div
            id={`pricing-panel-${activeCategory}`}
            role="tabpanel"
            className="max-w-2xl mx-auto rounded-2xl border border-border overflow-hidden shadow-sm"
          >
            {activeService.items.map((item, i) => (
              <div
                key={item.name}
                className={cn(
                  'flex items-center justify-between gap-4 px-6 py-4',
                  i % 2 === 0 ? 'bg-white' : 'bg-surface-2',
                )}
              >
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 flex-shrink-0 text-brand-dark" aria-hidden="true" />
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
        )}

        {/* CTA */}
        <div className="mt-10 text-center bg-surface-4 rounded-2xl p-8">
          <p className="text-h3 font-heading text-navy mb-2">
            Бесплатная консультация для новых пациентов
          </p>
          <p className="text-body text-text-secondary mb-6">
            Узнайте точную стоимость лечения на бесплатном первичном осмотре
          </p>
          <CTAButton>Записаться бесплатно</CTAButton>
        </div>
      </Container>
    </section>
  )
}
