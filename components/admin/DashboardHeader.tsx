'use client'

import { ChevronLeft, ChevronRight, Filter, Search, Users, LayoutGrid, PanelLeftOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const WEEKDAYS_RU = ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота']
const MONTHS_RU   = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря',
]

function formatDate(d: Date) {
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]}, ${WEEKDAYS_RU[d.getDay()]}`
}

type ViewMode = 'day' | 'week'

interface Props {
  selectedDate: Date
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  viewMode: ViewMode
  onViewChange: (v: ViewMode) => void
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export default function DashboardHeader({
  selectedDate, onPrev, onNext, onToday, viewMode, onViewChange,
  sidebarOpen, onToggleSidebar,
}: Props) {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-slate-200 flex-shrink-0">

      {/* Left: sidebar toggle + date navigation */}
      <div className="flex items-center gap-3">
        {/* Sidebar toggle — visible when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
            aria-label="Показать боковую панель"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={onToday}
            className="px-3 h-8 text-sm font-medium text-slate-700 border border-slate-200
                       rounded-lg hover:bg-slate-50 transition-colors"
          >
            Сегодня
          </button>
          <button
            onClick={onPrev}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onNext}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-sm font-semibold text-slate-800">{formatDate(selectedDate)}</span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        <button className="px-3 h-8 text-sm font-medium text-slate-700 border border-slate-200
                           rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5">
          Продать
          <ChevronRight className="w-3 h-3 rotate-90" />
        </button>

        <span className="text-sm font-medium text-slate-600 px-2">0 Т</span>

        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange('day')}
            className={cn(
              'px-3 h-8 text-sm font-medium transition-colors',
              viewMode === 'day'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-50',
            )}
          >
            День
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={cn(
              'px-3 h-8 text-sm font-medium transition-colors border-l border-slate-200',
              viewMode === 'week'
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-50',
            )}
          >
            Неделя
          </button>
        </div>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
          <Filter className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
          <Users className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500">
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

    </header>
  )
}
