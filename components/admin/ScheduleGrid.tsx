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
const END_HOUR    = 19
const SLOT_MIN    = 30          // minutes per row
const SLOT_H      = 48          // px per slot (30 min)

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
const BASE_MIN = timeToMinutes(START_HOUR, 0)

function slotLabel(slotIndex: number) {
  const totalMin = START_HOUR * 60 + slotIndex * SLOT_MIN
  const h = Math.floor(totalMin / 60)
  const m = totalMin % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MIN
const gridHeight  = TOTAL_SLOTS * SLOT_H

export default function ScheduleGrid({ staff, appointments }: Props) {
  return (
    <div className="flex h-full overflow-hidden">

      {/* Time labels — left */}
      <div className="w-16 flex-shrink-0 relative" style={{ height: gridHeight + 48 }}>
        {/* Staff header spacer */}
        <div className="h-12" />
        {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
          <div
            key={i}
            className="absolute flex items-start justify-end pr-3"
            style={{ top: 48 + i * SLOT_H, height: SLOT_H, left: 0, right: 0 }}
          >
            {i % 2 === 0 && (
              <span className="text-[11px] text-slate-400 font-medium -translate-y-2">
                {slotLabel(i)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-max" style={{ minHeight: gridHeight + 48 }}>

          {/* Inner flex: staff columns + right time labels */}
          <div className="flex">

            {/* Staff columns */}
            {staff.map(member => {
              const memberAppts = appointments.filter(a => a.staffId === member.id)
              return (
                <div key={member.id} className="flex-1 min-w-[300px] relative border-l border-slate-200">

                  {/* Staff header */}
                  <div className="h-12 flex flex-col items-start justify-center px-4 bg-white border-b border-slate-200 sticky top-0 z-10">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mb-0.5">
                      <span className="text-xs text-slate-600 font-semibold">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="h-4 bg-white border-b border-slate-200 sticky top-12 z-10 px-4">
                    <span className="text-xs font-semibold text-slate-700">{member.name}</span>
                    <span className="text-[10px] text-slate-400 ml-1">{member.role}</span>
                  </div>

                  {/* Grid rows */}
                  <div className="relative" style={{ height: gridHeight }}>
                    {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'absolute left-0 right-0 border-b',
                          i % 2 === 0
                            ? 'border-slate-200'
                            : 'border-slate-100 border-dashed',
                        )}
                        style={{ top: i * SLOT_H, height: SLOT_H }}
                      />
                    ))}

                    {/* Appointment cards */}
                    {memberAppts.map(appt => {
                      const startMin  = timeToMinutes(appt.startHour, appt.startMin) - BASE_MIN
                      const topPx     = (startMin / SLOT_MIN) * SLOT_H
                      const heightPx  = Math.max((appt.durationMin / SLOT_MIN) * SLOT_H - 2, 24)

                      return (
                        <div
                          key={appt.id}
                          className={cn(
                            'absolute left-2 right-2 rounded-lg border px-2 py-1 cursor-pointer',
                            'flex flex-col justify-start overflow-hidden',
                            STATUS_COLORS[appt.status],
                          )}
                          style={{ top: topPx + 1, height: heightPx }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-semibold bg-white/30 rounded px-1 leading-4">
                              {STATUS_LABELS[appt.status]}
                            </span>
                            <span className="text-xs font-semibold text-white truncate">
                              {appt.clientName}
                            </span>
                          </div>
                          <span className="text-[10px] text-white/80 mt-0.5">
                            {String(appt.startHour).padStart(2,'0')}:{String(appt.startMin).padStart(2,'0')}
                            {' — '}
                            {(() => {
                              const end = appt.startHour * 60 + appt.startMin + appt.durationMin
                              return `${String(Math.floor(end/60)).padStart(2,'0')}:${String(end%60).padStart(2,'0')}`
                            })()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {/* Time labels — right */}
            <div className="w-16 flex-shrink-0 relative border-l border-slate-200" style={{ height: gridHeight + 48 }}>
              <div className="h-12" />
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => (
                <div
                  key={i}
                  className="absolute flex items-start justify-start pl-3"
                  style={{ top: 48 + i * SLOT_H, height: SLOT_H, left: 0, right: 0 }}
                >
                  {i % 2 === 0 && (
                    <span className="text-[11px] text-slate-400 font-medium -translate-y-2">
                      {slotLabel(i)}
                    </span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
