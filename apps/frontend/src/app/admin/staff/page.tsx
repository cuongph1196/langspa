'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import api from '@/lib/api'
import { Staff, StaffRole } from '@/types/admin'
import PageHeader from '@/components/admin/shared/PageHeader'
import ConfirmModal from '@/components/admin/shared/ConfirmModal'
import StaffTable from '@/components/admin/staff/StaffTable'
import StaffForm from '@/components/admin/staff/StaffForm'

const roleOptions: { value: '' | StaffRole; label: string }[] = [
  { value: '', label: 'Tất cả vai trò' },
  { value: 'TECHNICIAN', label: 'Kỹ thuật viên' },
  { value: 'RECEPTIONIST', label: 'Lễ tân' },
  { value: 'MANAGER', label: 'Quản lý' },
  { value: 'CASHIER', label: 'Thu ngân' },
]

export default function AdminStaffPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<'' | StaffRole>('')
  const [formOpen, setFormOpen] = useState(false)
  const [editStaff, setEditStaff] = useState<Staff | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['admin', 'staff'],
    queryFn: () => api.get<Staff[]>('/admin/staff').then((r) => r.data),
  })

  const filtered = staff.filter((s) => {
    const matchSearch = !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || (s.phone ?? '').includes(search)
    const matchRole = !roleFilter || s.position === roleFilter
    return matchSearch && matchRole
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/staff/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      setDeleteId(null)
    },
  })

  return (
    <div>
      <PageHeader
        title="Quản lý Nhân viên"
        description={`${filtered.length} nhân viên`}
        actions={
          <button
            onClick={() => { setEditStaff(undefined); setFormOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Thêm nhân viên
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Tìm theo tên, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as '' | StaffRole)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <StaffTable
          staff={filtered}
          loading={isLoading}
          onEdit={(s) => { setEditStaff(s); setFormOpen(true) }}
          onDelete={setDeleteId}
        />
      </div>

      <StaffForm isOpen={formOpen} onClose={() => setFormOpen(false)} staff={editStaff} />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Xóa nhân viên"
        message="Nhân viên sẽ bị xóa vĩnh viễn khỏi hệ thống. Bạn có chắc chắn không?"
        confirmLabel="Xóa"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
