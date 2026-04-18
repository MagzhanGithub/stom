'use client'

import { useEffect, useState, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, CheckCircle2, User } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services'
import Button from '@/components/ui/Button'
import { clinic } from '@/lib/config'

// ── Calendar helpers ────────────────────────────────────────────────────────
const MONTHS_CAL = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь']
const WEEKDAYS_CAL = ['пн','вт','ср','чт','пт','сб','вс']

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells: { day: number; current: boolean }[] = []
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, current: false })
  for (let d = 1; d <= daysInMonth; d++)        cells.push({ day: d, current: true })
  const remaining = (Math.ceil(cells.length / 7) * 7) - cells.length
  for (let d = 1; d <= remaining; d++)           cells.push({ day: d, current: false })
  return cells
}

function isWeekend(year: number, month: number, day: number) {
  return new Date(year, month, day).getDay() === 0
}

// ── Time slots ───────────────────────────────────────────────────────────────
const TIME_GROUPS = [
  { label: 'Утро',  times: ['09:00','09:30','10:00','10:30','11:00','11:30'] },
  { label: 'День',  times: ['12:00','12:30','14:00','14:30','15:00','15:30'] },
  { label: 'Вечер', times: ['16:00','16:30','17:00','17:30','18:00','18:30'] },
]

interface StaffItem { id: string; name: string; role: string }

interface FormData {
  staffId:   string
  serviceId: string
  date:      string
  time:      string
  name:      string
  phone:     string
  comment:   string
  consent:   boolean
}

function formatDate(iso: string): string {
  if (!iso) return iso
  const [y, m, d] = iso.split('-')
  return `${d}.${m}.${y}`
}

export default function BookingModal() {
  const [isOpen,    setIsOpen]    = useState(false)
  const [step,      setStep]      = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [staffList, setStaffList] = useState<StaffItem[]>([])
  const [staffLoaded, setStaffLoaded] = useState(false)
  const [form, setForm] = useState<FormData>({
    staffId: '', serviceId: '', date: '', time: '', name: '', phone: '', comment: '', consent: false,
  })
  const [errors,      setErrors]      = useState<Partial<Record<keyof FormData, string>>>({})
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const firstFocusRef = useRef<HTMLButtonElement>(null)
  const todayDate     = new Date()
  const [calView, setCalView] = useState({ year: todayDate.getFullYear(), month: todayDate.getMonth() })

  // Derived step config
  const isMultiStaff  = staffList.length >= 2
  const totalFormSteps = isMultiStaff ? 4 : 3
  const successStep    = totalFormSteps + 1   // 4 (single) or 5 (multi)
  // step offsets: multi → service=2, date=3, personal=4 | single → service=1, date=2, personal=3
  const S = isMultiStaff ? 1 : 0  // shift

  // Listen for global open event
  useEffect(() => {
    const handler = () => { setIsOpen(true); setStep(1) }
    window.addEventListener('open-booking-modal', handler)
    return () => window.removeEventListener('open-booking-modal', handler)
  }, [])

  // Fetch staff list when modal opens
  useEffect(() => {
    if (!isOpen) return
    setStaffLoaded(false)
    fetch('/api/staff')
      .then(r => r.json())
      .then((data: StaffItem[]) => { setStaffList(data); setStaffLoaded(true) })
      .catch(() => { setStaffList([]); setStaffLoaded(true) })
  }, [isOpen])

  // Focus first element
  useEffect(() => {
    if (isOpen) setTimeout(() => firstFocusRef.current?.focus(), 50)
  }, [isOpen])

  // Fetch confirmed bookings for the selected date (per staff if multi)
  useEffect(() => {
    if (!form.date) return
    fetch('/api/bookings')
      .then(r => r.json())
      .then((data: { date: string; time: string; status: string; staffId: string }[]) => {
        setBookedTimes(
          data.filter(b =>
            b.date === form.date &&
            b.status === 'confirmed' &&
            (!isMultiStaff || b.staffId === form.staffId)
          ).map(b => b.time)
        )
      })
      .catch(() => {})
  }, [form.date, form.staffId, isMultiStaff])

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
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    if (!validateStep3()) return
    setIsLoading(true)

    const service = services.find(s => s.id === form.serviceId)
    const resolvedStaffId = staffList.length === 1 ? staffList[0]!.id : form.staffId
    const staffName = staffList.find(s => s.id === resolvedStaffId)?.name ?? ''

    const lines = [
      `📋 *Новая запись — ${clinic.name}*`,
      ``,
      `👤 Имя: ${form.name}`,
      `📞 Телефон: ${form.phone}`,
      `🦷 Услуга: ${service?.title ?? '—'}`,
      staffName ? `👨‍⚕️ Врач: ${staffName}` : '',
      form.date ? `📅 Дата: ${formatDate(form.date)}` : '',
      form.time ? `🕐 Время: ${form.time}` : '',
      form.comment ? `💬 ${form.comment}` : '',
    ].filter(Boolean).join('\n')

    const waUrl = `https://wa.me/${clinic.phone.replace('+', '')}?text=${encodeURIComponent(lines)}`
    const a = document.createElement('a')
    a.href = waUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'
    document.body.appendChild(a); a.click(); document.body.removeChild(a)

    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name,
          phone:      form.phone,
          service:    service?.title ?? '—',
          serviceId:  form.serviceId,
          date:       form.date,
          time:       form.time,
          staffId:    resolvedStaffId,
        }),
      })
    } catch { /* non-blocking */ }

    setIsLoading(false)
    setStep(successStep)
  }

  const today    = new Date().toISOString().split('T')[0]!
  const maxDate  = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0]!
  const maxCalDate  = new Date(Date.now() + 90 * 86400000)
  const maxCalYear  = maxCalDate.getFullYear()
  const maxCalMonth = maxCalDate.getMonth()

  if (!isOpen) return null

  const isSuccess  = step === successStep
  const stepLabel  = !isSuccess && staffLoaded && staffList.length > 0
    ? `Шаг ${step} из ${totalFormSteps}`
    : undefined

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
                     shadow-xl overflow-hidden"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 id="booking-modal-title" className="text-h3 font-heading text-navy">
                {isSuccess ? 'Вы записаны!' : 'Запись на приём'}
              </h2>
              {stepLabel && (
                <p className="text-caption text-text-muted mt-0.5">{stepLabel}</p>
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
          {!isSuccess && staffLoaded && staffList.length > 0 && (
            <div className="h-1 bg-surface-2">
              <div
                className="h-full bg-brand transition-all duration-300"
                style={{ width: `${(step / totalFormSteps) * 100}%` }}
                role="progressbar"
                aria-valuenow={step}
                aria-valuemin={1}
                aria-valuemax={totalFormSteps}
              />
            </div>
          )}

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">

            {/* Loading staff */}
            {!staffLoaded && (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* No staff — booking blocked */}
            {staffLoaded && staffList.length === 0 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
                  <User className="w-10 h-10 text-slate-400" aria-hidden="true" />
                </div>
                <h3 className="text-h3 font-heading text-navy mb-3">Запись недоступна</h3>
                <p className="text-body text-text-secondary mb-6">
                  У нас сейчас нет стоматолога. Пожалуйста, позвоните нам напрямую.
                </p>
                <Button variant="secondary" fullWidth onClick={close}>
                  Закрыть
                </Button>
              </div>
            )}

            {/* Step: choose staff (multi-staff only, step 1) */}
            {staffLoaded && isMultiStaff && step === 1 && (
              <div>
                <p className="text-body font-heading font-semibold text-navy mb-4">
                  Выберите стоматолога
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {staffList.map(s => (
                    <button
                      key={s.id}
                      ref={s.id === staffList[0]?.id ? firstFocusRef : undefined}
                      onClick={() => { update('staffId', s.id); setStep(2) }}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl border text-left',
                        'transition-all duration-150 hover:border-brand hover:bg-brand-lighter',
                        form.staffId === s.id
                          ? 'border-brand bg-brand-lighter'
                          : 'border-border bg-white',
                      )}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-body text-text-primary font-medium">{s.name}</p>
                        <p className="text-caption text-text-muted">{s.role}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted flex-shrink-0 ml-auto" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step: choose service */}
            {staffLoaded && staffList.length > 0 && step === 1 + S && (
              <div>
                <p className="text-body font-heading font-semibold text-navy mb-4">
                  Выберите услугу
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {services.map(s => (
                    <button
                      key={s.id}
                      ref={!isMultiStaff && (s.id === form.serviceId || (!form.serviceId && services[0]?.id === s.id)) ? firstFocusRef : undefined}
                      onClick={() => { update('serviceId', s.id); update('date', today); setStep(2 + S) }}
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

            {/* Step: choose date & time */}
            {staffLoaded && staffList.length > 0 && step === 2 + S && (() => {
              const calCells = getCalendarDays(calView.year, calView.month)
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-navy">
                      {MONTHS_CAL[calView.month]}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => setCalView(v => {
                          const m = v.month === 0 ? 11 : v.month - 1
                          const y = v.month === 0 ? v.year - 1 : v.year
                          return { year: y, month: m }
                        })}
                        className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCalView(v => {
                          const m = v.month === 11 ? 0 : v.month + 1
                          const y = v.month === 11 ? v.year + 1 : v.year
                          return { year: y, month: m }
                        })}
                        disabled={calView.year > maxCalYear || (calView.year === maxCalYear && calView.month >= maxCalMonth)}
                        className="p-1.5 rounded-lg hover:bg-surface-2 text-text-muted disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 text-center">
                    {WEEKDAYS_CAL.map((d, i) => (
                      <div key={d} className={cn('text-[11px] font-medium py-1', i >= 5 ? 'text-red-400' : 'text-text-muted')}>
                        {d}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 text-center gap-y-1">
                    {calCells.map((cell, i) => {
                      if (!cell.current) {
                        return (
                          <div key={i} className="w-8 h-8 mx-auto flex items-center justify-center text-[13px] text-text-muted/30">
                            {cell.day}
                          </div>
                        )
                      }
                      const mm = String(calView.month + 1).padStart(2, '0')
                      const dd = String(cell.day).padStart(2, '0')
                      const dateStr  = `${calView.year}-${mm}-${dd}`
                      const weekend  = isWeekend(calView.year, calView.month, cell.day)
                      const disabled = dateStr < today || dateStr > maxDate || weekend
                      const selected = form.date === dateStr
                      return (
                        <button
                          key={i}
                          disabled={disabled}
                          onClick={() => { update('date', dateStr); update('time', '') }}
                          className={cn(
                            'w-8 h-8 mx-auto rounded-full text-[13px] font-medium transition-colors',
                            disabled && 'text-text-muted/40 cursor-not-allowed',
                            !disabled && !selected && 'hover:bg-surface-2 text-text-primary',
                            selected && 'bg-[#1e1f2d] text-white font-bold',
                          )}
                        >
                          {cell.day}
                        </button>
                      )
                    })}
                  </div>

                  {(() => {
                    const isSat  = form.date ? new Date(form.date + 'T00:00:00').getDay() === 6 : false
                    const n      = new Date()
                    const nowStr = `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`
                    const isPast   = (t: string) => form.date === today && t <= nowStr
                    const isBooked = (t: string) => bookedTimes.includes(t)
                    return (
                      <div className="space-y-3 pt-3 border-t border-border">
                        {TIME_GROUPS.map(group => {
                          const times = isSat ? group.times.filter(t => t <= '12:30') : group.times
                          if (times.length === 0) return null
                          return (
                            <div key={group.label}>
                              <p className="text-sm font-semibold text-text-primary mb-2">{group.label}</p>
                              <div className="grid grid-cols-3 gap-2">
                                {times.map(t => {
                                  const disabled = isPast(t) || isBooked(t)
                                  return (
                                    <button
                                      key={t}
                                      disabled={disabled}
                                      onClick={() => !disabled && update('time', t)}
                                      className={cn(
                                        'py-2 rounded-xl text-sm font-medium border transition-all duration-150',
                                        disabled
                                          ? 'border-border text-slate-300 bg-slate-50 cursor-not-allowed line-through'
                                          : form.time === t
                                            ? 'bg-[#1e1f2d] border-[#1e1f2d] text-white'
                                            : 'border-border hover:border-[#1e1f2d] hover:bg-slate-50 text-text-secondary',
                                      )}
                                    >
                                      {t}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>
              )
            })()}

            {/* Step: personal data */}
            {staffLoaded && staffList.length > 0 && step === 3 + S && (
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
                  />
                  {errors.name && (
                    <p className="mt-1 text-body-sm text-state-error" role="alert">{errors.name}</p>
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
                  />
                  {errors.phone && (
                    <p className="mt-1 text-body-sm text-state-error" role="alert">{errors.phone}</p>
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
                <p className="text-caption text-text-muted">
                  Мы свяжемся только для подтверждения записи. Без предоплаты.
                </p>
              </div>
            )}

            {/* Success */}
            {isSuccess && (
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
          {!isSuccess && staffList.length > 0 && step > 1 && (
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStep(prev => prev - 1)}
                className="flex-shrink-0"
              >
                Назад
              </Button>
              {step === 2 + S && (
                <Button
                  fullWidth
                  disabled={!form.date || !form.time}
                  onClick={() => setStep(3 + S)}
                >
                  Продолжить
                </Button>
              )}
              {step === 3 + S && (
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
