'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Stethoscope, Scissors, Zap, Crown,
  AlignCenter, Sparkles, Baby, ArrowRight, ChevronDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services'
import { staggerContainer, fadeUp, viewportOnce } from '@/lib/animations'

const iconMap: Record<string, React.ElementType> = {
  Stethoscope, Scissors, Zap, Crown, AlignCenter, Sparkles, Baby,
}

export default function ServicesSection() {
  const [showAll, setShowAll] = useState(false)
  const visible = showAll ? services : services.slice(0, 6)

  return (
    <section
      id="uslugi"
      className="section-padding bg-surface-1"
      aria-labelledby="services-heading"
    >
      <Container>
        <SectionHeading
          overline="ЧТО МЫ ЛЕЧИМ"
          title="Полный спектр стоматологических услуг"
          subtitle="От лечения кариеса до имплантации — всё под одной крышей"
          id="services-heading"
          center
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {visible.map(service => {
            const Icon = iconMap[service.icon] ?? Stethoscope
            return (
              <motion.div key={service.id} variants={fadeUp}>
                <ServiceCard service={service} Icon={Icon} />
              </motion.div>
            )
          })}
        </motion.div>

        {services.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(prev => !prev)}
              className="inline-flex items-center gap-2 text-brand-dark font-heading font-semibold
                         text-body hover:text-brand-darker transition-colors duration-150"
              aria-expanded={showAll}
            >
              {showAll ? 'Скрыть' : 'Показать все услуги'}
              <ChevronDown
                className={cn('w-4 h-4 transition-transform duration-300', showAll && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </Container>
    </section>
  )
}

interface ServiceCardProps {
  service: (typeof services)[number]
  Icon: React.ElementType
}

function ServiceCard({ service, Icon }: ServiceCardProps) {
  const priceText = service.priceFrom === 0
    ? 'Бесплатно'
    : `от ${service.priceFrom.toLocaleString('ru')} ₸`

  return (
    <Link
      href={`/uslugi/${service.slug}`}
      className={cn(
        'group relative flex flex-col gap-4 p-6 rounded-xl',
        'border border-border bg-white',
        'transition-all duration-250 hover:-translate-y-1 hover:shadow-card-hover hover:border-brand-light',
        service.popular && 'ring-2 ring-brand ring-offset-2',
      )}
      aria-label={`${service.title} — ${priceText}`}
    >
      {service.popular && (
        <span className="absolute top-4 right-4 text-caption font-heading font-semibold
                         bg-brand-lighter text-brand-darker px-2.5 py-1 rounded-full">
          Популярно
        </span>
      )}

      <div className="w-12 h-12 rounded-xl bg-surface-4 flex items-center justify-center
                      group-hover:bg-brand-lighter transition-colors duration-250">
        <Icon className="w-6 h-6 text-brand-dark" aria-hidden="true" />
      </div>

      <div className="flex-1">
        <h3 className="text-h3 font-heading mb-2 text-navy group-hover:text-brand-dark
                       transition-colors duration-150">
          {service.title}
        </h3>
        <p className="text-body-sm text-text-secondary leading-relaxed">
          {service.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-body-sm font-semibold text-text-brand">{priceText}</span>
        <span className="flex items-center gap-1 text-body-sm text-brand-dark font-heading font-medium
                         group-hover:gap-2 transition-all duration-150">
          Подробнее <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
