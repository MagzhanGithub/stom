'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell, ShoppingBag, CreditCard, List, Package,
  ChevronDown, LogOut,
} from 'lucide-react'
import CalendarWidget from './CalendarWidget'

const quickActions = [
  { icon: ShoppingBag, label: 'Продажа товара' },
  { icon: CreditCard,  label: 'Новый платеж'   },
  { icon: List,        label: 'Список услуг'   },
  { icon: Package,     label: 'Каталог товаров' },
]

interface Props {
  selectedDate: Date
  onDateChange: (d: Date) => void
  adminLogin: string
  hasNotification?: boolean
}

export default function Sidebar({ selectedDate, onDateChange, adminLogin, hasNotification }: Props) {
  const router = useRouter()
  const [favOpen, setFavOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#1e1f2d] flex flex-col h-full overflow-y-auto">

      {/* Logo + bell (bell toggles sidebar) */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <span className="font-heading font-extrabold text-lg text-white tracking-wide">dent</span>
        <button
          className="relative text-slate-400 hover:text-white transition-colors"
          aria-label="Уведомления"
        >
          <Bell className="w-5 h-5" />
          {hasNotification && (
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Mini calendar */}
      <CalendarWidget selectedDate={selectedDate} onSelect={onDateChange} />

      {/* Quick actions */}
      <div className="px-3 pb-3 grid grid-cols-2 gap-2 border-b border-white/10">
        {quickActions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5
                       hover:bg-white/10 transition-colors text-slate-300 hover:text-white"
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] leading-tight text-center font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Избранное */}
      <div className="border-b border-white/10">
        <button
          onClick={() => setFavOpen(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3
                     text-slate-400 hover:text-white transition-colors text-sm"
        >
          <span className="flex items-center gap-2">
            <span className="text-slate-500">☆</span>
            Избранное
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${favOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {favOpen && (
          <div className="px-4 pb-3 text-xs text-slate-500">Нет избранных</div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User + logout */}
      <div className="border-t border-white/10">
        <div className="flex items-center justify-between px-4 py-4">
          <p className="text-sm font-semibold text-white truncate">{adminLogin}</p>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="ml-2 flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors"
            aria-label="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </aside>
  )
}
