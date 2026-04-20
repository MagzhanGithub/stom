'use client'

import { useState, useEffect } from 'react'
import { User, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Appointment {
  id: string
  clientName: string
  startHour: number
  startMin: number
  durationMin: number
  status: 'new' | 'confirmed' | 'completed' | 'cancelled'
  staffId: string
}

export interface StaffMember {
  id: string
  name: string
  role: string
}

interface Props {
  staff: StaffMember[]
  appointments: Appointment[]
  selectedDate?: Date
  onDeleteStaff?: (id: string) => void
  isFullView?: boolean  // true = main admin (orphaned bookings go to first column)
  onAppointmentClick?: (id: string) => void
  onSlotClick?: (staffId: string, hour: number, min: number) => void
}

const START_HOUR  = 9
const END_HOUR    = 19
const SLOT_MIN    = 30
const SLOT_H      = 32

const STATUS_COLORS: Record<Appointment['status'], string> = {
  new:       'bg-violet-100 border-violet-300 text-violet-900',
  confirmed: 'bg-blue-400 border-blue-500 text-white',
  completed: 'bg-slate-300 border-slate-400 text-slate-700',
  cancelled: 'bg-red-300 border-red-400 text-red-900',
}

function timeToMinutes(h: number, m: number) { return h * 60 + m }
const BASE_MIN    = timeToMinutes(START_HOUR, 0)
const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN
const gridHeight  = TOTAL_SLOTS * SLOT_H

function slotLabel(i: number): string {
  if (i % 2 === 0) {
    const h = START_HOUR + i / 2
    return `${String(h).padStart(2, '0')}:00`
  }
  return '30'
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function ScheduleGrid({ staff, appointments, selectedDate, onDeleteStaff, isFullView = true, onAppointmentClick, onSlotClick }: Props) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const displayStaff = staff.length > 0 ? staff : [{ id: '__empty__', name: '', role: '' }]

  const isToday      = selectedDate ? isSameDay(selectedDate, now) : isSameDay(new Date(), now)
  const currentMin   = timeToMinutes(now.getHours(), now.getMinutes()) - BASE_MIN
  const showTimeLine = isToday && currentMin >= 0 && currentMin <= (END_HOUR - START_HOUR) * 60
  const currentTopPx = (currentMin / SLOT_MIN) * SLOT_H

  return (
    <div className="h-full overflow-auto pb-36 md:pb-4">
      <div className="w-full md:min-w-max">

      {/* Staff header — scrolls together with grid */}
      <div className="sticky top-0 z-30 bg-white border-b border-slate-200 flex min-w-max">
        {/* Single person icon in the time column area */}
        <div
          className="w-12 md:w-16 flex-shrink-0 flex items-center justify-center bg-white border-r border-slate-200"
          style={{ position: 'sticky', left: 0, zIndex: 20 }}
        >
          <User className="w-4 h-4 text-slate-300" />
        </div>

        {displayStaff.map(member => (
          <div
            key={member.id}
            className={cn(
              'flex-shrink-0 md:flex-1 md:min-w-[320px] flex flex-col items-center py-2.5 gap-0.5 border-l border-r border-slate-200 relative overflow-hidden',
              displayStaff.length === 1 ? 'min-w-[calc(100vw-3.5rem)]' : 'min-w-[calc(46vw-20px)]',
            )}
          >
            <p className="text-xs font-semibold text-slate-700">{member.name}</p>
            <p className="text-[10px] text-slate-400">{member.role}</p>

            {/* Delete button — only for real staff */}
            {onDeleteStaff && member.id !== '__empty__' && (
              <button
                onClick={() => onDeleteStaff(member.id)}
                className="absolute top-1 right-1 p-1 rounded-md text-slate-300 hover:text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {/* Mobile end spacer so last column right border is visible */}
        <div className="w-2 flex-shrink-0 md:hidden" />
        {/* Spacer matching right time column */}
        <div className="hidden md:block w-16 flex-shrink-0" />
      </div>

      {/* Grid */}
      <div>
        <div className="flex w-full md:min-w-max pt-4" style={{ height: gridHeight + 16 }}>

          {/* Left time column — sticky left */}
          <div
            className="w-12 md:w-16 flex-shrink-0 bg-white border-r border-slate-200 relative"
            style={{ position: 'sticky', left: 0, zIndex: 20 }}
          >
            {/* Current time pill — inside left column */}
            {showTimeLine && (
              <div
                className="absolute right-0 z-20 pointer-events-none pr-1"
                style={{ top: currentTopPx - 9 }}
              >
                <div className="bg-[#0d1a2b] text-white text-[10px] font-bold rounded px-1.5 py-0.5 leading-none whitespace-nowrap">
                  {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
                </div>
              </div>
            )}

            {Array.from({ length: TOTAL_SLOTS + 1 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start justify-end pr-2"
                style={{ height: i < TOTAL_SLOTS ? SLOT_H : 0 }}
              >
                <span className={cn(
                  '-translate-y-2',
                  i % 2 === 0
                    ? 'text-[11px] text-slate-500 font-medium'
                    : 'text-[10px] text-slate-300',
                )}>
                  {slotLabel(i)}
                </span>
              </div>
            ))}
            {/* Covers rounded card corners that peek at the column boundary */}
            <div className="absolute inset-y-0 left-full w-2 bg-white pointer-events-none" />
          </div>

          {/* Staff columns */}
          {displayStaff.map((member, colIdx) => {
            const knownIds = new Set(displayStaff.map(s => s.id))
            const memberAppts = member.id === '__empty__'
              ? appointments
              : [
                  ...appointments.filter(a => a.staffId === member.id),
                  // orphaned bookings (staffId unknown) go to first column — only when all staff visible
                  ...(isFullView && colIdx === 0 ? appointments.filter(a => !knownIds.has(a.staffId)) : []),
                ]
            return (
              <div
                key={member.id}
                className={cn(
                  'flex-shrink-0 md:flex-1 md:min-w-[320px] border-l border-r border-slate-200',
                  displayStaff.length === 1 ? 'min-w-[calc(100vw-3.5rem)]' : 'min-w-[calc(46vw-20px)]',
                  onSlotClick && 'cursor-cell',
                )}
                style={{ position: 'relative', height: gridHeight }}
                onClick={(e) => {
                  if (!onSlotClick || member.id === '__empty__') return
                  const rect = e.currentTarget.getBoundingClientRect()
                  const relY = Math.max(0, e.clientY - rect.top)
                  const slotIdx = Math.floor(relY / SLOT_H)
                  const totalMin = BASE_MIN + slotIdx * SLOT_MIN
                  onSlotClick(member.id, Math.floor(totalMin / 60), totalMin % 60)
                }}
              >
                {/* Grid lines */}
                {Array.from({ length: TOTAL_SLOTS + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0"
                    style={{ top: i * SLOT_H, height: 1 }}
                  >
                    {i % 2 === 0
                      ? <div className="h-px bg-slate-200 w-full" />
                      : <div className="w-full border-t border-dashed border-slate-200" />
                    }
                  </div>
                ))}

                {/* Current time horizontal line */}
                {showTimeLine && (
                  <div
                    className="absolute left-0 right-0 h-px bg-[#0d1a2b] z-10 pointer-events-none"
                    style={{ top: currentTopPx }}
                  />
                )}

                {/* Appointment cards */}
                {memberAppts.map(appt => {
                  const startMin = timeToMinutes(appt.startHour, appt.startMin) - BASE_MIN
                  const topPx    = (startMin / SLOT_MIN) * SLOT_H
                  const heightPx = Math.max((appt.durationMin / SLOT_MIN) * SLOT_H - 2, 20)
                  const endMin   = appt.startHour * 60 + appt.startMin + appt.durationMin

                  return (
                    <div
                      key={appt.id}
                      onClick={(e) => { e.stopPropagation(); onAppointmentClick?.(appt.id) }}
                      className={cn(
                        'absolute left-2 right-2 rounded-lg border px-2 py-0.5 cursor-pointer',
                        'flex items-center gap-1.5 overflow-hidden',
                        STATUS_COLORS[appt.status],
                      )}
                      style={{ top: topPx + 1, height: heightPx }}
                    >
                      <span className="text-[10px] font-semibold flex-shrink-0">
                        {String(appt.startHour).padStart(2,'0')}:{String(appt.startMin).padStart(2,'0')}
                        {'—'}
                        {String(Math.floor(endMin/60)).padStart(2,'0')}:{String(endMin%60).padStart(2,'0')}
                      </span>
                      <span className="text-xs truncate opacity-80">{appt.clientName}</span>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Mobile end spacer so last column right border is visible */}
          <div className="w-2 flex-shrink-0 md:hidden" />

          {/* Right time column — sticky right, desktop only */}
          <div
            className="hidden md:block w-16 flex-shrink-0 bg-white border-l border-slate-200"
            style={{ position: 'sticky', right: 0, zIndex: 10 }}
          >
            {Array.from({ length: TOTAL_SLOTS + 1 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start justify-start pl-3"
                style={{ height: i < TOTAL_SLOTS ? SLOT_H : 0 }}
              >
                <span className={cn(
                  '-translate-y-2',
                  i % 2 === 0
                    ? 'text-[11px] text-slate-500 font-medium'
                    : 'text-[10px] text-slate-300',
                )}>
                  {slotLabel(i)}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

      </div>
    </div>
  )
}
