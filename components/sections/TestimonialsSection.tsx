'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import { reviews } from '@/lib/reviews'
import { clinic } from '@/lib/config'

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  function prev() { setCurrent(i => (i - 1 + reviews.length) % reviews.length) }
  function next() { setCurrent(i => (i + 1) % reviews.length) }

  const review = reviews[current]!

  return (
    <section
      className="section-padding bg-navy"
      aria-labelledby="reviews-heading"
    >
      <Container>
        <SectionHeading
          overline="ОТЗЫВЫ"
          title="Что говорят наши пациенты"
          id="reviews-heading"
          center
          light
        />

        <div className="max-w-2xl mx-auto">
          <div className="relative bg-white rounded-3xl p-8 shadow-xl min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4" aria-label={`Оценка: ${review.rating} из 5`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>

                {/* Text */}
                <blockquote className="text-body text-text-primary leading-relaxed mb-6">
                  &ldquo;{review.text}&rdquo;
                </blockquote>

                {/* Author */}
                <footer className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-semibold text-navy">{review.name}</p>
                    <p className="text-body-sm text-text-muted">{review.procedure} · {review.date}</p>
                  </div>
                </footer>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white
                         flex items-center justify-center transition-colors duration-150"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Dots */}
            <div className="flex gap-2" role="tablist" aria-label="Навигация по отзывам">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === current}
                  aria-label={`Отзыв ${i + 1}`}
                  onClick={() => setCurrent(i)}
                  className={cn(
                    'rounded-full transition-all duration-200',
                    i === current
                      ? 'w-6 h-2.5 bg-brand'
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/50',
                  )}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white
                         flex items-center justify-center transition-colors duration-150"
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Google link */}
          <p className="text-center mt-6 text-body-sm text-white/60">
            <span className="flex items-center justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
              <span>
                {clinic.googleRating} · {clinic.googleReviewsCount} отзывов на Google
              </span>
            </span>
          </p>
        </div>
      </Container>
    </section>
  )
}
