'use client'

import { useState, useMemo } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import { services } from '@/lib/services'
import { cn } from '@/lib/utils'

function fmtPrice(min: number, max?: number) {
  if (min === 0) return 'Бесплатно'
  const f = (n: number) => n.toLocaleString('ru-RU')
  return max ? `${f(min)} – ${f(max)} ₸` : `от ${f(min)} ₸`
}

export default function ServicesListModal({ onClose }: { onClose: () => void }) {
  const [search,   setSearch]   = useState('')
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(services.map(s => s.id)))

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return services
    return services
      .map(cat => ({
        ...cat,
        items: (cat.items ?? []).filter(
          item => item.name.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q),
        ),
      }))
      .filter(cat => (cat.items?.length ?? 0) > 0)
  }, [search])

  function toggleCat(id: string) {
    setOpenCats(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />

      <div className="fixed inset-x-4 top-6 bottom-6 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[680px] bg-white rounded-2xl shadow-2xl z-[60] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <h2 className="text-base font-bold text-[#0d1a2b]">Список услуг</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-slate-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по названию услуги"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0d1a2b] placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Search className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm">Ничего не найдено</p>
            </div>
          )}

          {filtered.map(cat => (
            <div key={cat.id} className="border-b border-slate-100 last:border-b-0">
              {/* Category row */}
              <button
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center justify-between px-6 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              >
                <span className="text-sm font-semibold text-slate-600">{cat.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">{cat.items?.length ?? 0} услуг</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-400 transition-transform duration-200',
                      openCats.has(cat.id) && 'rotate-180',
                    )}
                  />
                </div>
              </button>

              {/* Items */}
              {openCats.has(cat.id) && (
                <div>
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_180px] px-6 py-2 border-b border-slate-50">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Услуга</span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide text-right">Цена, ₸</span>
                  </div>
                  {(cat.items ?? []).map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_180px] px-6 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0"
                    >
                      <span className="text-sm text-[#0d1a2b] leading-snug">{item.name}</span>
                      <span className={cn(
                        'text-sm text-right font-medium leading-snug',
                        item.priceFrom === 0 ? 'text-emerald-600' : 'text-slate-600',
                      )}>
                        {fmtPrice(item.priceFrom, item.priceTo)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
