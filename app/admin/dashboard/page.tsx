'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Smartphone, TrendingUp, ShoppingBag, Filter, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/admin/Sidebar'
import DashboardHeader from '@/components/admin/DashboardHeader'
import ScheduleGrid, { type Appointment, type StaffMember } from '@/components/admin/ScheduleGrid'
import SearchClientModal from '@/components/admin/SearchClientModal'
import AddStaffModal from '@/components/admin/AddStaffModal'
import DeleteStaffModal from '@/components/admin/DeleteStaffModal'
import BookingDetailPanel from '@/components/admin/BookingDetailPanel'
import AddAppointmentModal from '@/components/admin/AddAppointmentModal'
import type { BookingEntry } from '@/app/api/bookings/route'

const ADMIN_LOGIN = 'magzhan'

const MONTHS_FULL = [
  'января','февраля','марта','апреля','мая','июня',
  'июля','августа','сентября','октября','ноября','декабря',
]

function addDays(date: Date, days: number) {
  const d = new Date(date); d.setDate(d.getDate() + days); return d
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function formatNotifDate(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${parseInt(d!)} ${MONTHS_FULL[parseInt(m!) - 1]} ${y}`
}

async function patchBooking(id: string, status: BookingEntry['status']) {
  await fetch('/api/bookings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, status }),
  }).catch(() => {})
}

export default function AdminDashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [viewMode,     setViewMode]     = useState<'day' | 'week'>('day')
  const [sidebarOpen,  setSidebarOpen]  = useState(true)
  const [isMobile,     setIsMobile]     = useState(false)

  const [bookings,      setBookings]      = useState<BookingEntry[]>([])
  const [staff,         setStaff]         = useState<StaffMember[]>([])
  const [myStaffId,     setMyStaffId]     = useState<string | null>(null)
  const [notification,  setNotification]  = useState<BookingEntry | null>(null)
  const [showSearch,      setShowSearch]      = useState(false)
  const [showAddStaff,    setShowAddStaff]    = useState(false)
  const [deleteStaffItem, setDeleteStaffItem] = useState<StaffMember | null>(null)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [addAppt, setAddAppt] = useState<{ staffId: string; date: string; time: string } | null>(null)
  const shownIdsRef = useRef(new Set<string>())

  const hasUnread = bookings.some(b => b.status === 'new' || b.status === 'dismissed')

  // Fetch staff list
  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch('/api/staff')
      if (!res.ok) return
      const data: StaffMember[] = await res.json()
      setStaff(data)
    } catch { /* ignore */ }
  }, [])

  async function deleteStaff(id: string) {
    await fetch('/api/staff', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {})
    setDeleteStaffItem(null)
    fetchStaff()
  }

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

  // Fetch current user role
  useEffect(() => {
    fetch('/api/me')
      .then(r => r.json())
      .then((d: { staffId: string | null }) => setMyStaffId(d.staffId ?? null))
      .catch(() => {})
  }, [])

  // Initial staff fetch
  useEffect(() => { fetchStaff() }, [fetchStaff])

  // Poll /api/bookings every 3 seconds
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/bookings')
        if (!res.ok) return
        const data: BookingEntry[] = await res.json()
        setBookings(data)

        const unseen = data.filter(b => b.status === 'new' && !shownIdsRef.current.has(b.id))
        if (unseen.length > 0) {
          const latest = unseen[unseen.length - 1]!
          shownIdsRef.current.add(latest.id)
          setNotification(latest)
        }
      } catch { /* ignore */ }
    }
    poll()
    const interval = setInterval(poll, 3000)
    return () => clearInterval(interval)
  }, [])

  async function dismissNotification() {
    if (!notification) return
    await patchBooking(notification.id, 'dismissed')
    setBookings(prev => prev.map(b => b.id === notification.id ? { ...b, status: 'dismissed' } : b))
    setNotification(null)
  }

  function handleBellClick() {
    const unconfirmed = bookings.filter(b => b.status === 'new' || b.status === 'dismissed')
    if (unconfirmed.length > 0) setNotification(unconfirmed[unconfirmed.length - 1]!)
  }

  async function confirmAndGo(booking: BookingEntry) {
    await patchBooking(booking.id, 'confirmed')
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'confirmed' } : b))
    setSelectedDate(new Date(booking.date + 'T00:00:00'))
    setNotification(null)
  }

  // Staff accounts only see their own column
  const visibleStaff = myStaffId ? staff.filter(s => s.id === myStaffId) : staff

  const dateStr = toDateStr(selectedDate)
  async function changeBookingStatus(id: string, status: BookingEntry['status']) {
    await patchBooking(id, status)
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  async function updateBooking(id: string, fields: Partial<BookingEntry>) {
    await fetch('/api/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    }).catch(() => {})
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...fields } : b))
  }

  async function createAppointment(data: Omit<BookingEntry, 'id' | 'createdAt'>) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const entry: BookingEntry = await res.json()
        setBookings(prev => [entry, ...prev])
      }
    } catch { /* ignore */ }
  }

  const dayAppointments: Appointment[] = bookings
    .filter(b => ['confirmed', 'completed', 'cancelled'].includes(b.status) && b.date === dateStr)
    .map(b => {
      const [h, m] = b.time.split(':').map(Number)
      return {
        id:          b.id,
        clientName:  b.clientName,
        startHour:   h!,
        startMin:    m!,
        durationMin: 30,
        status:      b.status as Appointment['status'],
        staffId:     b.staffId,
      }
    })

  const bottomBar = [
    { icon: TrendingUp,  label: 'Выручка',        onClick: () => {} },
    { icon: ShoppingBag, label: 'Продажа',         onClick: () => {} },
    { icon: Filter,      label: 'Фильтры',         onClick: () => {} },
    { icon: Search,      label: 'Найти клиента',   onClick: () => setShowSearch(true) },
  ] as const

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 relative">

      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={cn(
        'h-full transition-transform duration-300 ease-out z-50',
        isMobile ? 'fixed inset-y-0 left-0' : 'relative flex-shrink-0',
        !sidebarOpen && '-translate-x-full',
        !isMobile && !sidebarOpen && 'hidden',
      )}>
        <Sidebar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          adminLogin={ADMIN_LOGIN}
          hasNotification={hasUnread}
          onBellClick={handleBellClick}
          onAddStaff={() => setShowAddStaff(true)}
          isAdmin={!myStaffId}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader
          selectedDate={selectedDate}
          onPrev={()   => setSelectedDate(d => addDays(d, viewMode === 'day' ? -1 : -7))}
          onNext={()   => setSelectedDate(d => addDays(d, viewMode === 'day' ?  1 :  7))}
          onToday={()  => setSelectedDate(new Date())}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onToggleSidebar={() => setSidebarOpen(v => !v)}
          hasNotification={hasUnread && !sidebarOpen}
        />

        <div className="flex-1 overflow-hidden bg-white relative">
          <ScheduleGrid
            staff={visibleStaff}
            appointments={dayAppointments}
            isFullView={!myStaffId}
            selectedDate={selectedDate}
            onDeleteStaff={id => {
              const member = staff.find(s => s.id === id)
              if (member) setDeleteStaffItem(member)
            }}
            onAppointmentClick={id => { setAddAppt(null); setSelectedBookingId(id) }}
            onSlotClick={(staffId, hour, min) => {
              setSelectedBookingId(null)
              const time = `${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}`
              setAddAppt({ staffId, date: dateStr, time })
            }}
          />

          {/* Booking detail panel */}
          {selectedBookingId && (() => {
            const b = bookings.find(x => x.id === selectedBookingId)
            if (!b) return null
            return (
              <BookingDetailPanel
                booking={b}
                staff={staff}
                onClose={() => setSelectedBookingId(null)}
                onStatusChange={changeBookingStatus}
                onUpdate={updateBooking}
              />
            )
          })()}

          {/* Add appointment modal */}
          {addAppt && (
            <AddAppointmentModal
              initialStaffId={addAppt.staffId}
              initialDate={addAppt.date}
              initialTime={addAppt.time}
              staff={visibleStaff.length > 0 ? visibleStaff : staff}
              onClose={() => setAddAppt(null)}
              onSave={async (data) => {
                await createAppointment(data)
                setAddAppt(null)
              }}
            />
          )}

          {/* Mobile floating Сегодня */}
          <button
            onClick={() => setSelectedDate(new Date())}
            className="md:hidden fixed bottom-20 right-4 px-4 py-2 bg-white border border-slate-200
                       rounded-full text-sm font-medium text-slate-700 shadow-lg z-30"
          >
            Сегодня
          </button>
        </div>
      </div>

      {/* Mobile admin bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex">
        {bottomBar.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex-1 flex flex-col items-center gap-1 py-3 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium leading-none">{label}</span>
          </button>
        ))}
      </div>

      {/* Notification popup */}
      {notification && (
        <div
          className="group fixed bottom-6 z-50 w-72 bg-[#0d1a2b] rounded-2xl p-4 shadow-2xl transition-all duration-300"
          style={{ left: !isMobile && sidebarOpen ? '228px' : '16px' }}
        >
          <button
            onClick={dismissNotification}
            className={cn(
              'absolute top-3 right-3 transition-opacity text-white/40 hover:text-white',
              'opacity-100 md:opacity-0 md:group-hover:opacity-100',
            )}
            aria-label="Закрыть уведомление"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0 pr-5">
              <p className="text-sm font-semibold text-white mb-1">Новая запись</p>
              <div className="space-y-0.5 text-xs text-white/70">
                <p>Клиент: {notification.clientName}</p>
                <p>Телефон: {notification.phone}</p>
                <p>Услуга: {notification.service}</p>
                {notification.date && notification.time && (
                  <p>Время: {formatNotifDate(notification.date)} в {notification.time}</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => confirmAndGo(notification)}
            className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-[#0d1a2b]
                       text-sm font-bold rounded-xl transition-colors"
          >
            Перейти к записи
          </button>
        </div>
      )}

      {/* Search client modal */}
      {showSearch && (
        <SearchClientModal bookings={bookings} onClose={() => setShowSearch(false)} />
      )}

      {/* Add staff modal */}
      {showAddStaff && (
        <AddStaffModal
          onClose={() => setShowAddStaff(false)}
          onAdded={fetchStaff}
        />
      )}

      {/* Delete staff modal */}
      {deleteStaffItem && (
        <DeleteStaffModal
          staff={deleteStaffItem}
          onClose={() => setDeleteStaffItem(null)}
          onConfirm={() => deleteStaff(deleteStaffItem.id)}
        />
      )}

    </div>
  )
}
