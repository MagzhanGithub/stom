'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { LogOut } from 'lucide-react'

export default function AdminDashboardPage() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-surface-4 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 text-center">

        {/* Logo */}
        <p className="font-heading font-extrabold text-2xl mb-1">
          <span className="text-brand-dark">Zhanar</span>
          <span className="text-navy"> Dent</span>
        </p>
        <p className="text-body-sm text-text-muted mb-8">Панель управления</p>

        <p className="text-body text-text-secondary mb-8">
          Добро пожаловать! Здесь скоро появятся записи клиентов, аналитика и управление расписанием.
        </p>

        <button
          onClick={handleLogout}
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-navy
                     text-navy font-heading font-semibold hover:bg-navy hover:text-white
                     transition-colors duration-150 disabled:opacity-60"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          {loading ? 'Выход...' : 'Выйти'}
        </button>

      </div>
    </div>
  )
}
