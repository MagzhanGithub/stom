'use client'

import { useState } from 'react'
import { X, ChevronLeft, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingEntry } from '@/app/api/bookings/route'
import type { StaffMember, Appointment } from './ScheduleGrid'

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']

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

function fmtDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[(m ?? 1) - 1]}`
}

function calcEnd(time: string, durationMin: number) {
  const [h, m] = time.split(':').map(Number)
  const t = (h ?? 0) * 60 + (m ?? 0) + durationMin
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
  { key: 'completed', label: 'Пришёл',    active: 'bg-green-50 border-green-400 text-green-800 font-semibold' },
  { key: 'cancelled', label: 'Не пришёл', active: 'bg-red-50   border-red-400   text-red-800   font-semibold' },
]

function tToMin(t: string) {
  const [h, m] = t.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

function wouldOverlap(
  startMin: number, durMin: number,
  appts: Appointment[], excludeId: string, staffId: string,
) {
  return appts.some(a => {
    if (a.id === excludeId || a.staffId !== staffId) return false
    const aStart = a.startHour * 60 + a.startMin
    return startMin < aStart + a.durationMin && aStart < startMin + durMin
  })
}

function fmtDuration(min: number) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} мин`
  if (m === 0) return `${h} ч`
  return `${h} ч ${m} мин`
}

interface Props {
  booking: BookingEntry
  staff: StaffMember[]
  appointments: Appointment[]
  onClose: () => void
  onStatusChange: (id: string, status: BookingEntry['status']) => void
  onUpdate: (id: string, fields: Partial<BookingEntry>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function BookingDetailPanel({ booking, staff, appointments, onClose, onStatusChange, onUpdate, onDelete }: Props) {
  const dur = booking.durationMin ?? 30
  const [isEditing,   setIsEditing]   = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [deleting,    setDeleting]    = useState(false)
  const [confirmDel,  setConfirmDel]  = useState(false)
  const [editForm,  setEditForm]    = useState({
    staffId:     booking.staffId,
    date:        booking.date,
    time:        booking.time,
    durationMin: dur,
  })

  function updateEdit<K extends keyof typeof editForm>(k: K, v: (typeof editForm)[K]) {
    setEditForm(p => ({ ...p, [k]: v }))
  }

  async function saveEdit() {
    setSaving(true)
    await onUpdate(booking.id, editForm)
    setSaving(false)
    setIsEditing(false)
  }

  const member  = staff.find(s => s.id === (isEditing ? editForm.staffId : booking.staffId))
  const timeEnd = calcEnd(isEditing ? editForm.time : booking.time, isEditing ? editForm.durationMin : dur)
  const waUrl   = `https://wa.me/${booking.phone.replace(/\D/g, '')}`

  return (
    <>
      {/* Mobile backdrop */}
      <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={onClose} />

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
        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center
                       text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Закрыть"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
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

          {/* Staff + appointment info / Edit form */}
          <div className="px-5 py-4 border-b border-slate-100">
            {!isEditing ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-slate-500">{initials(member?.name ?? '—')}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#0d1a2b] leading-tight">{member?.name ?? '—'}</p>
                    <p className="text-xs text-slate-400">{member?.role ?? ''}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-[#0d1a2b] transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Изменить
                    </button>
                    {!confirmDel ? (
                      <button
                        onClick={() => setConfirmDel(true)}
                        className="flex items-center gap-1 text-xs text-slate-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Удалить
                      </button>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setConfirmDel(false)}
                          className="text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          disabled={deleting}
                          onClick={async () => {
                            setDeleting(true)
                            await onDelete(booking.id)
                          }}
                          className="text-[10px] text-red-500 hover:text-red-700 font-semibold transition-colors disabled:opacity-50"
                        >
                          {deleting ? '...' : 'Подтвердить'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span>📅 {fmtDate(booking.date)}</span>
                  <span className="text-slate-300">·</span>
                  <span className="font-semibold text-[#0d1a2b]">{booking.time}–{timeEnd}</span>
                  <span className="text-slate-300">·</span>
                  <span>{fmtDuration(dur)}</span>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {/* Staff select */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    Сотрудник
                  </label>
                  <select
                    value={editForm.staffId}
                    onChange={e => updateEdit('staffId', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
                  >
                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                {/* Date */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={e => updateEdit('date', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
                  />
                </div>
                {/* Time + Duration */}
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block mb-1">
                    Время и длительность
                  </label>
                  <div className="flex gap-2 items-center mb-2">
                    <select
                      value={editForm.time}
                      onChange={e => updateEdit('time', e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
                    >
                      {TIME_OPTIONS.map(t => {
                        const conflict = wouldOverlap(tToMin(t), editForm.durationMin, appointments, booking.id, editForm.staffId)
                        return <option key={t} value={t} disabled={conflict}>{t}{conflict ? ' ✗' : ''}</option>
                      })}
                    </select>
                    <span className="text-xs text-slate-400 flex-shrink-0">→ {timeEnd}</span>
                  </div>
                  <select
                    value={editForm.durationMin}
                    onChange={e => updateEdit('durationMin', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-[#0d1a2b] bg-white focus:outline-none focus:border-[#0d1a2b]"
                  >
                    {DURATION_OPTIONS.map(d => {
                      const conflict = wouldOverlap(tToMin(editForm.time), d.value, appointments, booking.id, editForm.staffId)
                      return <option key={d.value} value={d.value} disabled={conflict}>{d.label}{conflict ? ' ✗' : ''}</option>
                    })}
                  </select>
                </div>
                {/* Save / Cancel */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={saveEdit}
                    disabled={saving}
                    className="flex-1 py-2 rounded-xl bg-[#0d1a2b] text-white text-sm font-semibold hover:bg-[#1a2e45] transition-colors disabled:opacity-60"
                  >
                    {saving ? '...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            )}
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
