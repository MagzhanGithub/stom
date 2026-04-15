'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell, ShoppingBag, CreditCard, List, Package,
  ChevronDown, LogOut, Settings,
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
}

export default function Sidebar({ selectedDate, onDateChange }: Props) {
  const router = useRouter()
  const [favOpen, setFavOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#1e1f2d] flex flex-col h-full overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        <span className="font-heading font-extrabold text-lg text-white tracking-wide">dent</span>
        <button className="relative text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
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

      {/* User block */}
      <div className="border-t border-white/10">
        {/* Администрирование — active item */}
        <div className="mx-2 my-2 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-400">
          <Settings className="w-4 h-4 text-slate-900" />
          <span className="text-sm font-semibold text-slate-900">Администрирование</span>
        </div>

        {/* User info + logout */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">Magzhan</p>
            <p className="text-[10px] text-slate-500 truncate">magzhanabdikaiyr@gmail.com</p>
          </div>
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
