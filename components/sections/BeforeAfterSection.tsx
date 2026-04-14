'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { staggerContainer, fadeUp, viewportOnce } from '@/lib/animations'

interface Case {
  id: string
  label: string
  beforeLabel: string
  afterLabel: string
  beforeColor: string
  afterColor: string
}

const cases: Case[] = [
  {
    id: 'whitening',
    label: 'Отбеливание',
    beforeLabel: 'До отбеливания',
    afterLabel: 'После отбеливания',
    beforeColor: 'from-amber-50 to-amber-100',
    afterColor: 'from-brand-lighter to-surface-4',
  },
  {
    id: 'veneers',
    label: 'Виниры',
    beforeLabel: 'До виниров',
    afterLabel: 'После виниров',
    beforeColor: 'from-slate-100 to-slate-200',
    afterColor: 'from-brand-lighter to-white',
  },
  {
    id: 'implant',
    label: 'Имплантат',
    beforeLabel: 'До имплантации',
    afterLabel: 'После имплантации',
    beforeColor: 'from-red-50 to-rose-100',
    afterColor: 'from-brand-lighter to-surface-4',
  },
]

// Зуб SVG иконка
function ToothIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20 2C14 2 8 6 8 13c0 4 1.5 7 2 10 .5 3 1 8 2 12 .5 2 1.5 3 2.5 3s1.5-1 2-3l1-5c.5-2 1-3 2.5-3s2 1 2.5 3l1 5c.5 2 1 3 2 3s2-1 2.5-3c1-4 1.5-9 2-12 .5-3 2-6 2-10 0-7-6-11-12-11z" />
    </svg>
  )
}

function CompareSlider({ item }: { item: Case }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const clamp = (v: number) => Math.max(5, Math.min(95, v))

  const moveToEvent = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(clamp(((clientX - rect.left) / rect.width) * 100))
  }, [])

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; moveToEvent(e.clientX) }
  const onTouchStart = (e: React.TouchEvent) => {
    dragging.current = true
    moveToEvent(e.touches[0]!.clientX)
  }

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return
      const x = 'touches' in e ? e.touches[0]!.clientX : e.clientX
      moveToEvent(x)
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onMove, { passive: true })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [moveToEvent])

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] rounded-2xl overflow-hidden select-none cursor-col-resize"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      role="img"
      aria-label={`Сравнение: ${item.beforeLabel} / ${item.afterLabel}`}
    >
      {/* After (base layer — right side) */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.afterColor}
                       flex flex-col items-center justify-center gap-3`}>
        <ToothIcon className="w-16 h-20 text-brand/40" />
        <p className="text-brand-dark/60 text-body-sm font-heading font-semibold">
          Добавьте фото
        </p>
      </div>

      {/* Before (clipped to left of divider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        aria-hidden="true"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${item.beforeColor}
                         flex flex-col items-center justify-center gap-3`}>
          <ToothIcon className="w-16 h-20 text-text-muted/30" />
          <p className="text-text-muted/60 text-body-sm font-heading font-semibold">
            Добавьте фото
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full
                   bg-white shadow-xl flex items-center justify-center pointer-events-none"
        style={{ left: `${pos}%` }}
        aria-hidden="true"
      >
        <ChevronLeft className="w-3 h-3 text-text-muted absolute -left-0.5" />
        <ChevronRight className="w-3 h-3 text-text-muted absolute -right-0.5" />
      </div>

      {/* Labels */}
      <span
        className="absolute top-3 left-3 bg-navy/70 text-white text-caption px-2 py-1 rounded-md pointer-events-none"
        aria-hidden="true"
      >
        До
      </span>
      <span
        className="absolute top-3 right-3 bg-brand-dark/80 text-navy text-caption px-2 py-1 rounded-md pointer-events-none font-semibold"
        aria-hidden="true"
      >
        После
      </span>
    </div>
  )
}

export default function BeforeAfterSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="section-padding bg-surface-2" aria-labelledby="ba-heading">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeUp}>
            <SectionHeading
              overline="ДО И ПОСЛЕ"
              title="Результаты, которые говорят сами"
              subtitle="Перетащите разделитель, чтобы увидеть разницу"
              id="ba-heading"
              center
            />
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={fadeUp}
            className="flex justify-center gap-2 mb-8"
            role="tablist"
            aria-label="Категории примеров работ"
          >
            {cases.map((c, i) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={active === i}
                aria-controls={`ba-panel-${c.id}`}
                onClick={() => setActive(i)}
                className={`px-4 py-2 rounded-full text-body-sm font-heading font-medium transition-all duration-150
                  ${active === i
                    ? 'bg-brand text-navy shadow-brand'
                    : 'bg-white border border-border text-text-secondary hover:border-brand hover:bg-brand-lighter'
                  }`}
              >
                {c.label}
              </button>
            ))}
          </motion.div>

          {/* Slider */}
          <motion.div
            variants={fadeUp}
            className="max-w-lg mx-auto"
            id={`ba-panel-${cases[active]!.id}`}
            role="tabpanel"
          >
            <CompareSlider item={cases[active]!} />
            <p className="text-center text-caption text-text-muted mt-3">
              Фото работ будут добавлены. Перетащите разделитель для сравнения.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
