'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { clinic } from '@/lib/config'

export default function AltegioBookingModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handler = () => setIsOpen(true)
    window.addEventListener('open-booking-modal', handler)
    return () => window.removeEventListener('open-booking-modal', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function close() { setIsOpen(false) }

  const bookingUrl = clinic.altegioBookingUrl ?? ''

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Запись на приём"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          aria-hidden="true"
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-3xl
                     shadow-xl overflow-hidden flex flex-col"
          style={{ height: 'min(90vh, 680px)' }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
            <h2 className="text-h3 font-heading text-navy">Запись на приём</h2>
            <button
              onClick={close}
              className="w-9 h-9 rounded-full hover:bg-surface-2 flex items-center justify-center
                         text-text-muted hover:text-navy transition-colors duration-150"
              aria-label="Закрыть форму записи"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Altegio iframe */}
          <iframe
            src={bookingUrl}
            className="flex-1 w-full border-0"
            title="Онлайн запись Altegio"
            allow="payment"
          />
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
