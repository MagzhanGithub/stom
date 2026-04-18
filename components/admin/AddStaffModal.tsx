'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  onClose: () => void
  onAdded: () => void
}

const DAYS = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

export default function AddStaffModal({ onClose, onAdded }: Props) {
  const [name,     setName]     = useState('')
  const [role,     setRole]     = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [days,     setDays]     = useState<number[]>([0, 1, 2, 3, 4])
  const [timeFrom, setTimeFrom] = useState('09:00')
  const [timeTo,   setTimeTo]   = useState('18:00')
  const [loading,  setLoading]  = useState(false)

  function toggleDay(i: number) {
    setDays(prev => prev.includes(i) ? prev.filter(d => d !== i) : [...prev, i])
  }

  async function submit() {
    if (!name.trim() || !role.trim() || !phone.trim() || !password.trim()) return
    setLoading(true)
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name:     name.trim(),
        role:     role.trim(),
        phone:    phone.trim(),
        password: password.trim(),
        schedule: { days, from: timeFrom, to: timeTo },
      }),
    }).catch(() => {})
    setLoading(false)
    onAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:w-[420px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-lg font-bold text-slate-800 mb-6">Добавить сотрудника</h2>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Имя</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Например: Жанар"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Должность</label>
              <input
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Например: стоматолог"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Телефон</label>
              <input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+7 700 000-00-00"
                type="tel"
                inputMode="tel"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1.5 block">Пароль</label>
              <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Пароль для входа в систему"
                type="password"
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            {/* Schedule — days */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-2 block">График работы</label>
              <div className="flex gap-1.5 mb-3">
                {DAYS.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      'w-9 h-9 rounded-full text-xs font-semibold transition-colors flex-shrink-0',
                      days.includes(i)
                        ? 'bg-[#1e1f2d] text-white'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Time range */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">С</label>
                  <input
                    type="time"
                    value={timeFrom}
                    onChange={e => setTimeFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
                <span className="mt-5 text-slate-400">—</span>
                <div className="flex-1">
                  <label className="text-xs text-slate-500 mb-1 block">До</label>
                  <input
                    type="time"
                    value={timeTo}
                    onChange={e => setTimeTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-300"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={submit}
              disabled={loading || !name.trim() || !role.trim() || !phone.trim() || !password.trim()}
              className="w-full py-3 bg-[#1e1f2d] text-white font-semibold rounded-xl
                         disabled:opacity-40 transition-opacity mt-2"
            >
              {loading ? 'Добавляем...' : 'Добавить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
