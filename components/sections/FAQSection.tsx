'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'
import { faqItems } from '@/lib/faq'

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null)

  function toggle(id: string) {
    setOpenId(prev => (prev === id ? null : id))
  }

  return (
    <section
      className="section-padding bg-surface-2"
      aria-labelledby="faq-heading"
    >
      <Container narrow>
        <SectionHeading
          overline="ЧАСТО СПРАШИВАЮТ"
          title="Ответы на ваши вопросы"
          id="faq-heading"
          center
        />

        <div className="space-y-2" role="list">
          {faqItems.map(item => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                role="listitem"
                className={cn(
                  'rounded-xl border bg-white overflow-hidden transition-all duration-250',
                  isOpen ? 'border-brand-light shadow-sm' : 'border-border',
                )}
              >
                <button
                  id={`faq-btn-${item.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="text-h4 font-heading text-navy">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 flex-shrink-0 text-brand-dark transition-transform duration-300',
                      isOpen && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-6 pb-5 text-body text-text-secondary leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
