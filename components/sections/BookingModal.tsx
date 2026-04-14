'use client'

import { useEffect, useState, useRef } from 'react'
import { X, ChevronRight, CheckCircle2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services'
import Button from '@/components/ui/Button'
import { clinic } from '@/lib/config'

type Step = 1 | 2 | 3 | 4

interface FormData {
  serviceId: string
  date: string
  time: string
  name: string
  phone: string
  comment: string
  consent: boolean
}

function formatDate(iso: string): string {
  if (!iso) return iso
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '13:00', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '19:00',
]

export default function BookingModal() {
  const [isOpen, setIsOpen]   = useState(false)
  const [step, setStep]       = useState<Step>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm]       = useState<FormData>({
    serviceId: '', date: '', time: '', name: '', phone: '', comment: '', consent: false,
  })
  const [errors, setErrors]   = useState<Partial<Record<keyof FormData, string>>>({})
  const firstFocusRef         = useRef<HTMLButtonElement>(null)

  // Listen for global open event
  useEffect(() => {
    const handler = () => { setIsOpen(true); setStep(1) }
    window.addEventListener('open-booking-modal', handler)
    return () => window.removeEventListener('open-booking-modal', handler)
  }, [])

  // Focus first element when opens
  useEffect(() => {
    if (isOpen) setTimeout(() => firstFocusRef.current?.focus(), 50)
  }, [isOpen])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function close() { setIsOpen(false); setStep(1) }

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function validateStep3(): boolean {
    const e: typeof errors = {}
    if (!form.name.trim()) e.name = 'Введите ваше имя'
    if (!form.phone.trim()) e.phone = 'Введите номер телефона'
    else if (!/^\+?[0-9\s\-()]{10,15}$/.test(form.phone)) e.phone = 'Введите корректный номер'
    if (!form.consent) e.consent = 'Необходимо согласие'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    if (!validateStep3()) return
    setIsLoading(true)

    // Build WhatsApp message with booking details
    const service = services.find(s => s.id === form.serviceId)
    const lines = [
      `📋 *Новая запись — ${clinic.name}*`,
      ``,
      `👤 Имя: ${form.name}`,
      `📞 Телефон: ${form.phone}`,
      `🦷 Услуга: ${service?.title ?? '—'}`,
      form.date ? `📅 Дата: ${formatDate(form.date)}` : '',
      form.time ? `🕐 Время: ${form.time}` : '',
      form.comment ? `💬 ${form.comment}` : '',
    ].filter(Boolean).join('\n')

    const waUrl = `https://wa.me/${clinic.phone.replace('+', '')}?text=${encodeURIComponent(lines)}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    setIsLoading(false)
    setStep(4)
  }

  // Minimal dates for date picker (today + 30 days)
  const today = new Date().toISOString().split('T')[0]!
  const maxDate = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]!

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-60 flex items-end sm:items-center justify-center p-0 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
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
          className="relative z-10 w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl
                     shadow-xl overflow-hidden pb-16 sm:pb-0"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 id="booking-modal-title" className="text-h3 font-heading text-navy">
                {step === 4 ? 'Вы записаны!' : 'Запись на приём'}
              </h2>
              {step !== 4 && (
                <p className="text-caption text-text-muted mt-0.5">Шаг {step} из 3</p>
              )}
            </div>
            <button
              onClick={close}
              className="w-9 h-9 rounded-full hover:bg-surface-2 flex items-center justify-center
                         text-text-muted hover:text-navy transition-colors duration-150"
              aria-label="Закрыть форму записи"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Progress bar */}
          {step !== 4 && (
            <div className="h-1 bg-surface-2">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={3}
              />
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">

            {/* Step 1 — Service */}
            {step === 1 && (
              <div>
                <p className="text-body font-heading font-semibold text-navy mb-4">
                  Выберите услугу
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {services.map(s => (
                    <button
                      key={s.id}
                      ref={s.id === form.serviceId || (!form.serviceId && services[0]?.id === s.id) ? firstFocusRef : undefined}
                      onClick={() => { update('serviceId', s.id); setStep(2) }}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl border text-left',
                        'transition-all duration-150 hover:border-brand hover:bg-brand-lighter',
                        form.serviceId === s.id
                          ? 'border-brand bg-brand-lighter'
                          : 'border-border bg-white',
                      )}
                    >
                      <span className="text-body text-text-primary font-medium">{s.title}</span>
                      <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Date & Time */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="booking-date" className="text-label font-medium text-text-primary block mb-1.5">
                    Выберите дату
                  </label>
                  <input
                    id="booking-date"
                    type="date"
                    min={today}
                    max={maxDate}
                    value={form.date}
                    onChange={e => update('date', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border text-body
                               focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20
                               transition-colors duration-150"
                  />
                </div>

                {form.date && (
                  <div>
                    <p className="text-label font-medium text-text-primary mb-3">Выберите время</p>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map(t => (
                        <button
                          key={t}
                          onClick={() => update('time', t)}
                          className={cn(
                            'py-2.5 rounded-xl text-body-sm font-heading font-medium border transition-all duration-150',
                            form.time === t
                              ? 'bg-brand border-brand text-navy'
                              : 'border-border hover:border-brand hover:bg-brand-lighter text-text-secondary',
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3 — Personal data */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="booking-name" className="text-label font-medium text-text-primary block mb-1.5">
                    Ваше имя <span className="text-state-error" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    autoComplete="given-name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    placeholder="Например, Айгерим"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-body placeholder:text-text-muted',
                      'focus:outline-none focus:ring-2 transition-colors duration-150',
                      errors.name
                        ? 'border-state-error focus:ring-state-error/20'
                        : 'border-border focus:border-brand focus:ring-brand/20',
                    )}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-body-sm text-state-error" role="alert">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-phone" className="text-label font-medium text-text-primary block mb-1.5">
                    Номер телефона <span className="text-state-error" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    placeholder="+7 700 123-45-67"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border text-body placeholder:text-text-muted',
                      'focus:outline-none focus:ring-2 transition-colors duration-150',
                      errors.phone
                        ? 'border-state-error focus:ring-state-error/20'
                        : 'border-border focus:border-brand focus:ring-brand/20',
                    )}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-body-sm text-state-error" role="alert">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-comment" className="text-label font-medium text-text-primary block mb-1.5">
                    Комментарий{' '}
                    <span className="text-text-muted font-normal">(необязательно)</span>
                  </label>
                  <textarea
                    id="booking-comment"
                    rows={3}
                    value={form.comment}
                    onChange={e => update('comment', e.target.value)}
                    placeholder="Опишите жалобы или пожелания"
                    className="w-full px-4 py-3 rounded-xl border border-border text-body
                               placeholder:text-text-muted resize-none
                               focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20
                               transition-colors duration-150"
                  />
                </div>

                <div>
                  <label className="flex gap-3 items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={e => update('consent', e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-border accent-brand-dark"
                      aria-describedby={errors.consent ? 'consent-error' : undefined}
                    />
                    <span className="text-body-sm text-text-secondary">
                      Я согласен(а) на обработку персональных данных в соответствии
                      с политикой конфиденциальности {clinic.name}
                    </span>
                  </label>
                  {errors.consent && (
                    <p id="consent-error" className="mt-1 text-body-sm text-state-error ml-7" role="alert">
                      {errors.consent}
                    </p>
                  )}
                </div>

                <p className="text-caption text-text-muted">
                  Мы свяжемся только для подтверждения записи. Без предоплаты.
                </p>
              </div>
            )}

            {/* Step 4 — Success */}
            {step === 4 && (
              <div className="text-center py-4">
                <div className="w-20 h-20 rounded-full bg-state-success/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-state-success" aria-hidden="true" />
                </div>
                <h3 className="text-h2 font-heading text-navy mb-3">Отлично!</h3>
                <p className="text-body text-text-secondary mb-6">
                  Ваша заявка принята.&nbsp;
                  {form.date && form.time ? (
                    <>Ждём вас <strong className="text-navy">{formatDate(form.date)}</strong> в <strong className="text-navy">{form.time}</strong>.</>
                  ) : (
                    <>Мы свяжемся с вами для подтверждения времени.</>
                  )}
                </p>
                <div className="bg-surface-2 rounded-xl p-4 text-left text-body-sm text-text-secondary mb-6 space-y-1">
                  <p>📍 {clinic.fullAddress}</p>
                  {form.time && <p>🕐 {formatDate(form.date)} · {form.time}</p>}
                  <p>💬 Заявка отправлена в WhatsApp — мы свяжемся с вами</p>
                </div>
                <Button variant="secondary" fullWidth onClick={close}>
                  Закрыть
                </Button>
              </div>
            )}
          </div>

          {/* Footer actions */}
          {step !== 4 && step !== 1 && (
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStep(prev => (prev - 1) as Step)}
                className="flex-shrink-0"
              >
                Назад
              </Button>
              {step === 2 && (
                <Button
                  fullWidth
                  disabled={!form.date || !form.time}
                  onClick={() => setStep(3)}
                >
                  Продолжить
                </Button>
              )}
              {step === 3 && (
                <Button
                  fullWidth
                  isLoading={isLoading}
                  onClick={submit}
                >
                  Подтвердить запись
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
