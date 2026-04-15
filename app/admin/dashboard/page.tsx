'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
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

const ADMIN_LOGIN = 'magzhan'

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export default function AdminDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode,     setViewMode]     = useState<'day' | 'week'>('day')
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [isMobile,     setIsMobile]     = useState(false)

  // Auto-hide sidebar on mobile
  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 relative">

      {/* Mobile backdrop — tap to close sidebar */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'h-full transition-transform duration-300 ease-out z-50',
        isMobile ? 'fixed inset-y-0 left-0' : 'relative flex-shrink-0',
        !sidebarOpen && '-translate-x-full',
        // On desktop, when closed collapse width so main content fills the space
        !isMobile && !sidebarOpen && 'hidden',
      )}>
        <Sidebar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          adminLogin={ADMIN_LOGIN}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          selectedDate={selectedDate}
          onPrev={()  => setSelectedDate(d => addDays(d, viewMode === 'day' ? -1 : -7))}
          onNext={()  => setSelectedDate(d => addDays(d, viewMode === 'day' ?  1 :  7))}
          onToday={()  => setSelectedDate(new Date())}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
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
