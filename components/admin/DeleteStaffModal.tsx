'use client'

import { useState } from 'react'
import { X, Trash2 } from 'lucide-react'
import type { StaffMember } from './ScheduleGrid'

interface Props {
  staff: StaffMember
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteStaffModal({ staff, onClose, onConfirm }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Trash2 className="w-6 h-6 text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Удалить сотрудника</h2>
          <p className="text-sm text-slate-500 mb-6">
            Вы уверены, что хотите удалить <span className="font-semibold text-slate-700">{staff.name}</span>?
            Это действие нельзя отменить.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold
                         text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Нет
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold
                         text-white transition-colors disabled:opacity-50"
            >
              {loading ? 'Удаляем...' : 'Да, удалить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
