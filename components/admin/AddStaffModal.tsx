'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface Props {
  onClose: () => void
  onAdded: () => void
}

export default function AddStaffModal({ onClose, onAdded }: Props) {
  const [name, setName]     = useState('')
  const [role, setRole]     = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    if (!name.trim() || !role.trim()) return
    setLoading(true)
    await fetch('/api/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), role: role.trim() }),
    }).catch(() => {})
    setLoading(false)
    onAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:w-96 bg-white rounded-t-2xl md:rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-slate-800 mb-6">Добавить сотрудника</h2>

        <div className="space-y-4">
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
          <div>
            <label className="text-sm font-medium text-slate-600 mb-1.5 block">Должность</label>
            <input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Например: врач"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm
                         focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
          </div>
          <button
            onClick={submit}
            disabled={loading || !name.trim() || !role.trim()}
            className="w-full py-3 bg-[#1e1f2d] text-white font-semibold rounded-xl
                       disabled:opacity-40 transition-opacity mt-2"
          >
            {loading ? 'Добавляем...' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  )
}
