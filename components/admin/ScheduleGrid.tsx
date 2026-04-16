'use client'

import { useState, useEffect } from 'react'
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
}

// Grid config
const START_HOUR  = 9
const END_HOUR    = 18
const SLOT_MIN    = 30    // minutes per row
const SLOT_H      = 32    // px per slot → compact

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

export default function ScheduleGrid({ staff, appointments, selectedDate }: Props) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  const isToday      = selectedDate ? isSameDay(selectedDate, now) : isSameDay(new Date(), now)
  const currentMin   = timeToMinutes(now.getHours(), now.getMinutes()) - BASE_MIN
  const showTimePill = isToday && currentMin >= 0 && currentMin <= (END_HOUR - START_HOUR) * 60
  const currentTopPx = (currentMin / SLOT_MIN) * SLOT_H

  return (
    <div className="h-full overflow-auto">
      <div className="flex pt-8 w-full md:min-w-max" style={{ height: gridHeight + 32 }}>

        {/* Left time column — sticky left */}
        <div
          className="w-16 flex-shrink-0 bg-white border-r border-slate-200 relative"
          style={{ position: 'sticky', left: 0, zIndex: 10 }}
        >
          {/* Current time pill — floats to the right over the staff column */}
          {showTimePill && (
            <div
              className="absolute right-0 z-20 translate-x-full pointer-events-none"
              style={{ top: currentTopPx - 9 }}
            >
              <div className="bg-[#1e1f2d] text-white text-[10px] font-bold rounded px-1.5 py-0.5 leading-none whitespace-nowrap">
                {String(now.getHours()).padStart(2, '0')}:{String(now.getMinutes()).padStart(2, '0')}
              </div>
            </div>
          )}

          {/* TOTAL_SLOTS + 1 to include closing 18:00 label */}
          {Array.from({ length: TOTAL_SLOTS + 1 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start justify-end pr-3"
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

        {/* Staff columns */}
        {staff.map(member => {
          const memberAppts = appointments
          return (
            <div
              key={member.id}
              className="flex-1 min-w-0 md:min-w-[320px] border-l border-r border-slate-200"
              style={{ position: 'relative', height: gridHeight }}
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


        {/* Right time column — sticky right, hidden on mobile */}
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
  )
}
