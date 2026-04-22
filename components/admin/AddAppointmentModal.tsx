'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { services } from '@/lib/services'
import type { StaffMember } from './ScheduleGrid'

const TIME_OPTIONS: string[] = []
for (let h = 9; h < 19; h++) {
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:00`)
  TIME_OPTIONS.push(`${String(h).padStart(2, '0')}:30`)
}

const DURATION_OPTIONS = [
  { value: 30,  label: '30 мин' },
  { value: 60,  label: '1 час'  },
  { value: 90,  label: '1.5 ч'  },
  { value: 120, label: '2 часа' },
]

function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  const local = digits.startsWith('7') ? digits.slice(1) : digits
  const d = local.slice(0, 10)
  let result = '+7'
  if (d.length > 0) result += ' ' + d.slice(0, 3)
  if (d.length > 3) result += ' ' + d.slice(3, 6)
  if (d.length > 6) result += ' ' + d.slice(6, 8)
  if (d.length > 8) result += ' ' + d.slice(8, 10)
  return result
}

function calcEnd(time: string, durationMin: number) {
  const [h, m] = time.split(':').map(Number)
  const t = (h ?? 0) * 60 + (m ?? 0) + durationMin
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

interface SaveData {
  staffId:     string
  date:        string
  time:        string
  durationMin: number
  service:     string
  serviceId:   string
  clientName:  string
  phone:       string
  status:      'confirmed'
}

interface Props {
  initialStaffId: string
  initialDate:    string
  initialTime:    string
  staff:          StaffMember[]
  onClose:        () => void
  onSave:         (data: SaveData) => Promise<void>
}

export default function AddAppointmentModal({
  initialStaffId, initialDate, initialTime, staff, onClose, onSave,
}: Props) {
  const [form, setForm] = useState({
    staffId:     initialStaffId,
    date:        initialDate,
    time:        initialTime,
    durationMin: 30,
    serviceId:   '',
    clientName:  '',
    phone:       '+7',
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  function upd<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(p => ({ ...p, [k]: v }))
    setErrors(p => ({ ...p, [k]: undefined }))
  }

  async function handleSave() {
    const e: typeof errors = {}
    if (!form.serviceId)  e.serviceId  = 'Выберите услугу'
    if (!form.clientName) e.clientName = 'Введите имя'
    if (!form.phone || form.phone === '+7') e.phone = 'Введите телефон'
    else if (form.phone.replace(/\D/g, '').length !== 11) e.phone = 'Формат: +7 xxx xxx xx xx'
    setErrors(e)
    if (Object.keys(e).length > 0) return

    setSaving(true)
    const svc = services.find(s => s.id === form.serviceId)
    await onSave({
      staffId:     form.staffId,
      date:        form.date,
      time:        form.time,
      durationMin: form.durationMin,
      service:     svc?.title ?? '—',
      serviceId:   form.serviceId,
      clientName:  form.clientName,
      phone:       form.phone,
      status:      'confirmed',
    })
    setSaving(false)
  }

  return (
    <>
      <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className={cn(
        'flex flex-col bg-white overflow-hidden',
        'fixed bottom-0 left-0 right-0 max-h-[90vh] rounded-t-2xl shadow-2xl z-50',
        'md:absolute md:top-0 md:bottom-0 md:right-0 md:left-auto',
        'md:w-[340px] md:max-h-none md:rounded-none md:shadow-xl md:border-l md:border-slate-200 md:z-40',
      )}>

        {/* Desktop close tab */}
        <button
          onClick={onClose}
          className="hidden md:flex absolute -left-9 top-14 items-center justify-center
                     w-9 h-10 bg-white border border-slate-200 shadow-sm
                     rounded-l-lg text-slate-400 hover:text-[#0d1a2b] transition-colors z-10"
          aria-label="Закрыть"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-sm font-bold text-[#0d1a2b]">Новая запись</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Staff */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Сотрудник
            </label>
            <select
              value={form.staffId}
              onChange={e => upd('staffId', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
            >
              {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Дата
            </label>
            <input
              type="date"
              value={form.date}
              onChange={e => upd('date', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
            />
          </div>

          {/* Time + Duration */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Время и длительность
            </label>
            <div className="flex gap-2 items-center mb-2">
              <select
                value={form.time}
                onChange={e => upd('time', e.target.value)}
                className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="text-xs text-slate-400 flex-shrink-0">→ {calcEnd(form.time, form.durationMin)}</span>
            </div>
            <select
              value={form.durationMin}
              onChange={e => upd('durationMin', Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
            >
              {DURATION_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          {/* Service */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Услуга
            </label>
            <select
              value={form.serviceId}
              onChange={e => upd('serviceId', e.target.value)}
              className={cn(
                'w-full px-3 py-2.5 rounded-xl border text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]',
                errors.serviceId ? 'border-red-400' : 'border-slate-200',
              )}
            >
              <option value="">Выберите услугу...</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            {errors.serviceId && <p className="mt-1 text-xs text-red-500">{errors.serviceId}</p>}
          </div>

          {/* Client name */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Имя клиента
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={e => upd('clientName', e.target.value)}
              placeholder="Введите имя"
              className={cn(
                'w-full px-3 py-2.5 rounded-xl border text-sm text-[#0d1a2b] placeholder:text-slate-300 bg-white focus:outline-none focus:border-[#0d1a2b]',
                errors.clientName ? 'border-red-400' : 'border-slate-200',
              )}
            />
            {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Телефон
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => upd('phone', formatPhone(e.target.value))}
              placeholder="+7 xxx xxx xx xx"
              className={cn(
                'w-full px-3 py-2.5 rounded-xl border text-sm text-[#0d1a2b] placeholder:text-slate-300 bg-white focus:outline-none focus:border-[#0d1a2b]',
                errors.phone ? 'border-red-400' : 'border-slate-200',
              )}
            />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 rounded-xl bg-[#0d1a2b] hover:bg-[#1a2e45] text-white text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {saving ? 'Сохранение...' : 'Добавить запись'}
          </button>
        </div>

      </div>
    </>
  )
}
