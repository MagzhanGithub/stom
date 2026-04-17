'use client'

import { useState } from 'react'
import { X, Search } from 'lucide-react'
import type { BookingEntry } from '@/app/api/bookings/route'

interface Props {
  bookings: BookingEntry[]
  onClose: () => void
}

const STATUS_LABEL: Record<BookingEntry['status'], string> = {
  new:       'Новая',
  dismissed: 'Отклонена',
  confirmed: 'Подтверждена',
}

export default function SearchClientModal({ bookings, onClose }: Props) {
  const [query, setQuery] = useState('')

  const results = query.trim()
    ? bookings.filter(b =>
        b.clientName.toLowerCase().includes(query.toLowerCase()) ||
        b.phone.includes(query)
      )
    : []

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative w-full md:w-[480px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col"
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Найти клиента</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input */}
        <div className="px-5 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-slate-300">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Поиск по имени или телефону"
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 px-5 pb-8">
          {!query.trim() ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Search className="w-7 h-7 text-blue-400" />
              </div>
              <p className="text-sm text-slate-500 text-center max-w-[260px]">
                Быстро найдите клиента, чтобы увидеть историю посещений и примечания о нём.
              </p>
            </div>
          ) : results.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Ничего не найдено</p>
          ) : (
            <div className="space-y-2">
              {results.map(b => (
                <div key={b.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-800">{b.clientName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{b.phone} · {b.service}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {b.date} {b.time} · {STATUS_LABEL[b.status]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
