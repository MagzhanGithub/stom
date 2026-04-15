'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import DashboardHeader from '@/components/admin/DashboardHeader'
import ScheduleGrid, { type Appointment, type StaffMember } from '@/components/admin/ScheduleGrid'

// ── Mock data (заменить на реальные данные из БД) ──────────────────────────
const STAFF: StaffMember[] = [
  { id: 'anar', name: 'Анар', role: 'помощник' },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    clientName: 'Иван',
    startHour: 10,
    startMin: 0,
    durationMin: 30,
    status: 'new',
    staffId: 'anar',
  },
]
// ───────────────────────────────────────────────────────────────────────────

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function AdminDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode,     setViewMode]     = useState<'day' | 'week'>('day')

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* Sidebar */}
      <Sidebar selectedDate={selectedDate} onDateChange={setSelectedDate} />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          selectedDate={selectedDate}
          onPrev={()    => setSelectedDate(d => addDays(d, viewMode === 'day' ? -1 : -7))}
          onNext={()    => setSelectedDate(d => addDays(d, viewMode === 'day' ?  1 :  7))}
          onToday={()   => setSelectedDate(new Date())}
          viewMode={viewMode}
          onViewChange={setViewMode}
        />

        {/* Schedule */}
        <div className="flex-1 overflow-hidden bg-white">
          <ScheduleGrid
            staff={STAFF}
            appointments={MOCK_APPOINTMENTS}
          />
        </div>
      </div>

    </div>
  )
}
