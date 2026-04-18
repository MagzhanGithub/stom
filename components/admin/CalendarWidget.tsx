'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
]

function getCalendarDays(year: number, month: number) {
  // month: 0-indexed
  const firstDay = new Date(year, month, 1)
  // Monday-based: 0=Mon … 6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()

  const cells: { day: number; current: boolean }[] = []
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false })
  }
  return cells
}

interface Props {
  selectedDate: Date
  onSelect: (d: Date) => void
}

export default function CalendarWidget({ selectedDate, onSelect }: Props) {
  const today = new Date()
  const [view, setView] = useState({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() })

  // Sync calendar view when selectedDate changes from outside (e.g. header nav)
  useEffect(() => {
    setView({ year: selectedDate.getFullYear(), month: selectedDate.getMonth() })
  }, [selectedDate])

  function prev() {
    setView(v => {
      const m = v.month === 0 ? 11 : v.month - 1
      const y = v.month === 0 ? v.year - 1 : v.year
      return { year: y, month: m }
    })
  }
  function next() {
    setView(v => {
      const m = v.month === 11 ? 0 : v.month + 1
      const y = v.month === 11 ? v.year + 1 : v.year
      return { year: y, month: m }
    })
  }

  const allCells = getCalendarDays(view.year, view.month)
  // Only show 6th row if it contains at least one day of the current month
  const cells = allCells.slice(35).some(c => c.current) ? allCells : allCells.slice(0, 35)

  return (
    <div className="px-3 py-2">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prev} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-semibold text-white">
          {MONTHS[view.month]} {view.year}
        </span>
        <button onClick={next} className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-[10px] text-slate-500 font-medium py-0.5">{d}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const isToday =
            cell.current &&
            cell.day === today.getDate() &&
            view.month === today.getMonth() &&
            view.year === today.getFullYear()
          const isSelected =
            cell.current &&
            cell.day === selectedDate.getDate() &&
            view.month === selectedDate.getMonth() &&
            view.year === selectedDate.getFullYear()

          return (
            <button
              key={i}
              onClick={() => cell.current && onSelect(new Date(view.year, view.month, cell.day))}
              className={cn(
                'text-center text-[11px] leading-5 transition-colors w-7 h-7 mx-auto flex items-center justify-center rounded-full',
                !cell.current && 'text-slate-600 cursor-default',
                cell.current && !isSelected && !isToday && 'text-slate-300 hover:bg-white/10',
                isToday && !isSelected && 'bg-white/20 text-white font-bold',
                isSelected && !isToday && 'bg-white text-[#0d1a2b] font-bold',
                isSelected && isToday && 'bg-[#4ddde2] text-[#0d1a2b] font-bold',
              )}
            >
              {cell.day}
            </button>
          )
        })}
      </div>
    </div>
  )
}
