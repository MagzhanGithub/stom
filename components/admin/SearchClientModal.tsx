'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Search } from 'lucide-react'
import type { BookingEntry } from '@/app/api/bookings/route'
import type { ClientEntry } from '@/app/api/clients/route'

interface Props {
  bookings: BookingEntry[]
  onClose: () => void
}

const STATUS_LABEL: Record<BookingEntry['status'], string> = {
  new:       'Новая',
  dismissed: 'Отклонена',
  confirmed: 'Подтверждена',
  completed: 'Завершена',
  cancelled: 'Не пришёл',
}

const MONTHS = ['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек']
function fmtDate(iso: string) {
  const [, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[(m ?? 1) - 1]}`
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0] ?? '').join('').toUpperCase()
}

export default function SearchClientModal({ bookings, onClose }: Props) {
  const [query,   setQuery]   = useState('')
  const [clients, setClients] = useState<ClientEntry[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setClients([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/clients?q=${encodeURIComponent(query.trim())}`)
        if (res.ok) setClients(await res.json())
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full md:w-[480px] bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col max-h-[70vh] md:max-h-[85vh]">

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
            {query && (
              <button onClick={() => setQuery('')} className="text-slate-300 hover:text-slate-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
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
          ) : loading ? (
            <div className="flex justify-center py-10">
              <div className="w-5 h-5 border-2 border-slate-300 border-t-[#0d1a2b] rounded-full animate-spin" />
            </div>
          ) : clients.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-10">Ничего не найдено</p>
          ) : (
            <div className="space-y-3">
              {clients.map(client => {
                const clientBookings = bookings
                  .filter(b => b.phone.replace(/\s/g, '') === client.phone)
                  .sort((a, b) => b.createdAt - a.createdAt)
                return (
                  <div key={client.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[#0d1a2b] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{initials(client.name)}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.phone}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-white border border-slate-200 rounded-full px-2 py-0.5 flex-shrink-0">
                        {clientBookings.length} записей
                      </span>
                    </div>
                    {clientBookings.length > 0 && (
                      <div className="space-y-1.5">
                        {clientBookings.slice(0, 3).map(b => (
                          <div key={b.id} className="flex items-center justify-between text-xs text-slate-500 bg-white rounded-lg px-3 py-2 border border-slate-100">
                            <span className="font-medium text-slate-700 truncate mr-2">{b.service}</span>
                            <span className="flex-shrink-0 text-slate-400">{fmtDate(b.date)} · {STATUS_LABEL[b.status]}</span>
                          </div>
                        ))}
                        {clientBookings.length > 3 && (
                          <p className="text-[11px] text-slate-400 text-center pt-1">
                            и ещё {clientBookings.length - 3} записей
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
