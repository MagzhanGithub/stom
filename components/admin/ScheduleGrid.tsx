'use client'

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
}

// Grid config
const START_HOUR  = 9
const END_HOUR    = 18
const SLOT_MIN    = 30    // minutes per row
const SLOT_H      = 32    // px per slot → compact, fits more on screen

const STATUS_COLORS: Record<Appointment['status'], string> = {
  new:       'bg-emerald-400 border-emerald-500',
  confirmed: 'bg-blue-400 border-blue-500',
  completed: 'bg-slate-300 border-slate-400',
  cancelled: 'bg-red-300 border-red-400',
}

const STATUS_LABELS: Record<Appointment['status'], string> = {
  new: 'new', confirmed: 'подтвер.', completed: 'завершён', cancelled: 'отменён',
}

function timeToMinutes(h: number, m: number) { return h * 60 + m }
const BASE_MIN    = timeToMinutes(START_HOUR, 0)
const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN
const gridHeight  = TOTAL_SLOTS * SLOT_H

function slotLabel(i: number): string {
  if (i % 2 === 0) {
    // Full hour — show HH:00
    const h = START_HOUR + i / 2
    return `${String(h).padStart(2, '0')}:00`
  }
  // Half-hour — show just "30"
  return '30'
}

export default function ScheduleGrid({ staff, appointments }: Props) {
  return (
    // Single scrollable container — both time columns scroll with the grid
    <div className="h-full overflow-auto">
      <div className="flex" style={{ height: gridHeight, minWidth: 'max-content' }}>

        {/* Left time column — sticky left */}
        <div
          className="w-16 flex-shrink-0 bg-white border-r border-slate-200"
          style={{ position: 'sticky', left: 0, zIndex: 10 }}
        >
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
            <div
              key={i}
              className="flex items-start justify-end pr-3"
              style={{ height: SLOT_H }}
            >
              <span className={cn(
                // First slot: don't shift up so 09:00 stays visible
                i === 0 ? 'translate-y-0.5' : '-translate-y-2',
                i % 2 === 0
                  ? 'text-[11px] text-slate-500 font-medium'
                  : 'text-[10px] text-slate-300',
              )}>
                {slotLabel(i)}
              </span>
            </div>
          ))}
        </div>

        {/* Staff columns */}
        {staff.map(member => {
          const memberAppts = appointments.filter(a => a.staffId === member.id)
          return (
            <div
              key={member.id}
              className="flex-1 border-l border-slate-200"
              style={{ minWidth: 320, position: 'relative', height: gridHeight }}
            >
              {/* Grid rows */}
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    'absolute left-0 right-0 border-b',
                    i % 2 === 0 ? 'border-slate-200' : 'border-dashed border-slate-100',
                  )}
                  style={{ top: i * SLOT_H, height: SLOT_H }}
                />
              ))}

              {/* Appointment cards */}
              {memberAppts.map(appt => {
                const startMin = timeToMinutes(appt.startHour, appt.startMin) - BASE_MIN
                const topPx    = (startMin / SLOT_MIN) * SLOT_H
                const heightPx = Math.max((appt.durationMin / SLOT_MIN) * SLOT_H - 2, 20)
                const endMin   = appt.startHour * 60 + appt.startMin + appt.durationMin

                return (
                  <div
                    key={appt.id}
                    className={cn(
                      'absolute left-2 right-2 rounded-lg border px-2 py-0.5 cursor-pointer',
                      'flex items-center gap-1.5 overflow-hidden',
                      STATUS_COLORS[appt.status],
                    )}
                    style={{ top: topPx + 1, height: heightPx }}
                  >
                    <span className="text-[10px] font-semibold bg-white/30 rounded px-1 leading-4 flex-shrink-0">
                      {STATUS_LABELS[appt.status]}
                    </span>
                    <span className="text-xs font-semibold text-white truncate">
                      {appt.clientName}
                    </span>
                    <span className="text-[10px] text-white/80 ml-auto flex-shrink-0">
                      {String(appt.startHour).padStart(2,'0')}:{String(appt.startMin).padStart(2,'0')}
                      {' — '}
                      {String(Math.floor(endMin/60)).padStart(2,'0')}:{String(endMin%60).padStart(2,'0')}
                    </span>
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Right time column — sticky right */}
        <div
          className="w-16 flex-shrink-0 bg-white border-l border-slate-200"
          style={{ position: 'sticky', right: 0, zIndex: 10 }}
        >
          {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
            <div
              key={i}
              className="flex items-start justify-start pl-3"
              style={{ height: SLOT_H }}
            >
              <span className={cn(
                i === 0 ? 'translate-y-0.5' : '-translate-y-2',
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
  )
}
