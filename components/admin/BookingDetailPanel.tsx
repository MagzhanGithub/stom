'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingEntry } from '@/app/api/bookings/route'
import type { StaffMember } from './ScheduleGrid'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']

function fmtDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[(m ?? 1) - 1]}`
}

function endTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const t = (h ?? 0) * 60 + (m ?? 0) + 30
  return `${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

function WAIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const STATUS_OPTS: { key: BookingEntry['status']; label: string; active: string }[] = [
  { key: 'new',       label: 'Ожидание',   active: 'bg-amber-50  border-amber-400 text-amber-800 font-semibold' },
  { key: 'confirmed', label: 'Подтвердил', active: 'bg-blue-50   border-blue-400  text-blue-800  font-semibold' },
  { key: 'completed', label: 'Пришёл',     active: 'bg-green-50  border-green-400 text-green-800 font-semibold' },
  { key: 'cancelled', label: 'Не пришёл',  active: 'bg-red-50    border-red-400   text-red-800   font-semibold' },
]

interface Props {
  booking: BookingEntry
  staff: StaffMember[]
  onClose: () => void
  onStatusChange: (id: string, status: BookingEntry['status']) => void
}

export default function BookingDetailPanel({ booking, staff, onClose, onStatusChange }: Props) {
  const member  = staff.find(s => s.id === booking.staffId)
  const timeEnd = endTime(booking.time)
  const waUrl   = `https://wa.me/${booking.phone.replace(/\D/g, '')}`

  return (
    <>
      {/* Mobile backdrop */}
      <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Panel:
          mobile  → fixed bottom sheet (slides up from bottom)
          desktop → absolute right panel inside the relative grid container */}
      <div className={cn(
        'flex flex-col bg-white overflow-hidden',
        'fixed bottom-0 left-0 right-0 max-h-[82vh] rounded-t-2xl shadow-2xl z-50',
        'md:absolute md:top-0 md:bottom-0 md:right-0 md:left-auto',
        'md:w-[340px] md:max-h-none md:rounded-none md:shadow-xl md:border-l md:border-slate-200 md:z-20',
      )}>

        {/* Drag handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-sm font-bold text-[#0d1a2b]">Запись</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center
                       text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Staff + appointment info */}
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-slate-500">{initials(member?.name ?? '—')}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0d1a2b] leading-tight">{member?.name ?? '—'}</p>
                <p className="text-xs text-slate-400">{member?.role ?? ''}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>📅 {fmtDate(booking.date)}</span>
              <span className="text-slate-300">·</span>
              <span className="font-semibold text-[#0d1a2b]">{booking.time}–{timeEnd}</span>
              <span className="text-slate-300">·</span>
              <span>30 мин</span>
            </div>
          </div>

          {/* Status */}
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Статус</p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTS.map(opt => (
                <button
                  key={opt.key}
                  onClick={() => onStatusChange(booking.id, opt.key)}
                  className={cn(
                    'px-3 py-2 rounded-xl border text-xs transition-all duration-150 text-left',
                    booking.status === opt.key
                      ? opt.active
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service */}
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Услуга</p>
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">🦷</span>
              <span className="text-sm font-medium text-[#0d1a2b]">{booking.service}</span>
            </div>
          </div>

          {/* Client */}
          <div className="px-5 py-4">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-3">Клиент</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#0d1a2b] flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white">{initials(booking.clientName)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#0d1a2b] leading-tight">{booking.clientName}</p>
                <p className="text-xs text-slate-400">{booking.phone}</p>
              </div>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl
                         bg-[#25D366] hover:bg-[#20c45e] text-white text-sm font-semibold transition-colors"
            >
              <WAIcon />
              Написать в WhatsApp
            </a>
          </div>

        </div>
      </div>
    </>
  )
}
