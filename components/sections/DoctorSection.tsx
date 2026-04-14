'use client'

import { motion } from 'framer-motion'
import { Award, GraduationCap, Star } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import CTAButton from './CTAButton'
import { fadeUp, fadeIn, staggerContainer, viewportOnce } from '@/lib/animations'

const doctor = {
  name: 'Жанар Сейткалиева',
  title: 'Главный врач · Стоматолог-терапевт',
  experience: '12 лет',
  // photo: '/images/doctor.jpg', // TODO: добавить реальное фото
  credentials: [
    { icon: GraduationCap, text: 'ЮКГМА — диплом с отличием, 2012' },
    { icon: Award,          text: 'Сертификат по имплантологии, Москва' },
    { icon: Award,          text: 'Курс по эстетической реставрации, Алматы' },
    { icon: Star,           text: 'Более 3 000 успешных процедур' },
  ],
  quote:
    'Моя цель — чтобы каждый пациент уходил с улыбкой. Мы работаем без спешки и объясняем каждый шаг лечения.',
}

export default function DoctorSection() {
  return (
    <section
      className="section-padding bg-white"
      aria-labelledby="doctor-heading"
    >
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
        >
          {/* Photo column */}
          <motion.div variants={fadeIn} className="relative">
            <div className="relative aspect-[4/5] max-w-sm mx-auto lg:max-w-none rounded-3xl overflow-hidden shadow-xl
                            bg-gradient-to-br from-brand-lighter via-surface-4 to-brand-light
                            flex flex-col items-center justify-center gap-3">
              {/* Замените на <Image src={doctor.photo} ... /> когда получите реальное фото */}
              <svg viewBox="0 0 80 80" fill="none" className="w-28 h-28 opacity-30" aria-hidden="true">
                <circle cx="40" cy="28" r="16" fill="#2bbdc2" />
                <path d="M10 72c0-16.569 13.431-30 30-30s30 13.431 30 30" fill="#2bbdc2" />
              </svg>
              <p className="text-brand-dark/50 text-caption font-heading font-semibold tracking-wide">
                ФОТО ВРАЧА
              </p>
              {/* Experience badge */}
              <div
                className="absolute bottom-6 left-6 bg-white rounded-2xl shadow-lg px-4 py-3"
                aria-hidden="true"
              >
                <p className="text-caption text-text-muted">Опыт работы</p>
                <p className="text-h3 font-heading text-navy font-bold leading-tight">
                  {doctor.experience}
                </p>
              </div>
            </div>

            {/* Decorative teal blob */}
            <div
              className="absolute -bottom-8 -right-8 w-48 h-48 rounded-full bg-brand/15
                         -z-10 hidden lg:block"
              aria-hidden="true"
            />
          </motion.div>

          {/* Info column */}
          <motion.div variants={fadeUp} className="space-y-6">
            <SectionHeading
              overline="ГЛАВНЫЙ ВРАЧ"
              title={doctor.name}
              subtitle={doctor.title}
              id="doctor-heading"
            />

            {/* Quote */}
            <blockquote className="border-l-4 border-brand pl-4 italic text-body text-text-secondary">
              &ldquo;{doctor.quote}&rdquo;
            </blockquote>

            {/* Credentials */}
            <ul className="space-y-3" aria-label="Квалификация и достижения">
              {doctor.credentials.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <span
                    className="w-9 h-9 rounded-xl bg-surface-4 flex items-center justify-center flex-shrink-0"
                    aria-hidden="true"
                  >
                    <Icon className="w-4 h-4 text-brand-dark" />
                  </span>
                  <span className="text-body text-text-secondary">{text}</span>
                </li>
              ))}
            </ul>

            <CTAButton size="md">Записаться к врачу</CTAButton>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
