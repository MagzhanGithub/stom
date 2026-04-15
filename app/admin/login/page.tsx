'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [login,    setLogin]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Ошибка входа')
    }
  }

  return (
    <div className="min-h-screen bg-surface-4 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">

        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-heading font-extrabold text-2xl">
            <span className="text-brand-dark">Zhanar</span>
            <span className="text-navy"> Dent</span>
          </p>
          <p className="text-body-sm text-text-muted mt-1">Панель управления</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login" className="block text-label font-medium text-text-primary mb-1.5">
              Логин
            </label>
            <input
              id="login"
              type="text"
              autoComplete="username"
              value={login}
              onChange={e => setLogin(e.target.value)}
              placeholder="magzhan"
              required
              className="w-full px-4 py-3 rounded-xl border border-border text-body
                         focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20
                         transition-colors duration-150"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-label font-medium text-text-primary mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
                className="w-full px-4 py-3 pr-12 rounded-xl border border-border text-body
                           focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20
                           transition-colors duration-150"
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-navy
                           transition-colors duration-150 p-1"
                aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPass
                  ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                  : <Eye    className="w-4 h-4" aria-hidden="true" />
                }
              </button>
            </div>
          </div>

          {error && (
            <p className="text-body-sm text-state-error" role="alert">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-navy text-white font-heading font-semibold
                       hover:bg-navy-light transition-colors duration-150 disabled:opacity-60
                       disabled:cursor-not-allowed"
          >
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

      </div>
    </div>
  )
}
