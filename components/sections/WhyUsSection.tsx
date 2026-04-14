'use client'

import { ShieldCheck, Clock, Smile, BadgeCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { staggerContainer, fadeUp, viewportOnce } from '@/lib/animations'

const reasons = [
  {
    icon: Smile,
    title: 'Без боли',
    description:
      'Используем современные анестетики последнего поколения. Лечение комфортно и безболезненно — даже для тех, кто боится стоматологов.',
  },
  {
    icon: ShieldCheck,
    title: 'Современное оборудование',
    description:
      'Цифровой рентген, ультразвуковая чистка, стерилизация по европейским стандартам. Безопасность на первом месте.',
  },
  {
    icon: Clock,
    title: 'Удобная запись 24/7',
    description:
      'Записывайтесь онлайн в любое время суток — через сайт или Telegram. Принимаем в том числе в выходные дни.',
  },
  {
    icon: BadgeCheck,
    title: 'Прозрачные цены',
    description:
      'Все цены указаны на сайте. Перед лечением врач составляет план с точной стоимостью — никаких сюрпризов и скрытых платежей.',
  },
]

export default function WhyUsSection() {
  return (
    <section
      className="section-padding bg-surface-4"
      aria-labelledby="whyus-heading"
    >
      <Container>
        <SectionHeading
          overline="ПОЧЕМУ ZHANAR DENT"
          title="Мы делаем стоматологию комфортной"
          subtitle="Четыре причины, по которым нам доверяют тысячи пациентов"
          id="whyus-heading"
          center
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {reasons.map((reason, i) => {
            const Icon = reason.icon
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-lighter flex items-center justify-center mb-5">
                  <Icon className="w-7 h-7 text-brand-dark" aria-hidden="true" />
                </div>
                <h3 className="text-h3 font-heading text-navy mb-3">{reason.title}</h3>
                <p className="text-body-sm text-text-secondary leading-relaxed">{reason.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
