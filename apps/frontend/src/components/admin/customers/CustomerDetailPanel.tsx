'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Star, Edit2, Check } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import { AdminCustomer, UpdateCustomerDto } from '@/types/admin'
import { MembershipLevel } from '@/types/user'
import { MembershipBadge } from '@/components/admin/shared/StatusBadge'

interface CustomerDetailPanelProps {
  customer: AdminCustomer
  onClose: () => void
}

export default function CustomerDetailPanel({ customer, onClose }: CustomerDetailPanelProps) {
  const queryClient = useQueryClient()
  const [editingPoints, setEditingPoints] = useState(false)
  const [pointsInput, setPointsInput] = useState(String(customer.points))
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesInput, setNotesInput] = useState(customer.notes ?? '')

  const updateMutation = useMutation({
    mutationFn: (dto: UpdateCustomerDto) => api.patch(`/admin/customers/${customer.id}`, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'customers'] }),
  })

  function savePoints() {
    const points = parseInt(pointsInput, 10)
    if (!isNaN(points) && points >= 0) {
      updateMutation.mutate({ points })
      setEditingPoints(false)
    }
  }

  function saveNotes() {
    updateMutation.mutate({ notes: notesInput })
    setEditingNotes(false)
  }

  function handleMembershipChange(level: MembershipLevel) {
    updateMutation.mutate({ membershipLevel: level })
  }

  const membershipLevels: MembershipLevel[] = ['STANDARD', 'SILVER', 'GOLD', 'VIP']

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-900">Chi tiết khách hàng</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-xl font-bold text-primary-600">
              {customer.fullName.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{customer.fullName}</h3>
              <p className="text-sm text-gray-500">{customer.email}</p>
              <p className="text-sm text-gray-500">{customer.phone}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-gray-900">{customer.totalBookings}</p>
              <p className="text-xs text-gray-400 mt-0.5">Đặt lịch</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-sm font-bold text-gray-900">{formatPrice(customer.totalSpent)}</p>
              <p className="text-xs text-gray-400 mt-0.5">Chi tiêu</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-sm text-gray-400">Thành viên từ</p>
              <p className="text-xs font-medium text-gray-700 mt-0.5">{formatDate(customer.createdAt)}</p>
            </div>
          </div>

          {/* Membership */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Hạng thành viên</p>
            <div className="flex gap-2 flex-wrap">
              {membershipLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => handleMembershipChange(level)}
                  className={`transition-all ${customer.membershipLevel === level ? 'ring-2 ring-primary-400 ring-offset-1' : 'opacity-60 hover:opacity-100'}`}
                >
                  <MembershipBadge level={level} />
                </button>
              ))}
            </div>
          </div>

          {/* Points */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Điểm tích lũy</p>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" fill="currentColor" />
              {editingPoints ? (
                <>
                  <input
                    type="number"
                    value={pointsInput}
                    onChange={(e) => setPointsInput(e.target.value)}
                    className="w-28 px-2 py-1 text-sm border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                    min={0}
                  />
                  <button onClick={savePoints} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setEditingPoints(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="font-bold text-gray-900">{customer.points.toLocaleString('vi-VN')}</span>
                  <button onClick={() => setEditingPoints(true)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 size={13} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">Ghi chú</p>
              {!editingNotes && (
                <button onClick={() => setEditingNotes(true)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit2 size={13} />
                </button>
              )}
            </div>
            {editingNotes ? (
              <div>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
                  placeholder="Ghi chú về khách hàng..."
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={saveNotes}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3 min-h-[60px]">
                {customer.notes || 'Chưa có ghi chú'}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
