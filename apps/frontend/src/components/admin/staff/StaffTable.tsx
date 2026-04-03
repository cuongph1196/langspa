'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import api from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { Staff } from '@/types/admin'
import DataTable from '@/components/admin/shared/DataTable'
import { StaffRoleBadge, ActiveBadge } from '@/components/admin/shared/StatusBadge'

interface StaffTableProps {
  staff: Staff[]
  loading?: boolean
  onEdit: (staff: Staff) => void
  onDelete: (id: string) => void
}

export default function StaffTable({ staff, loading, onEdit, onDelete }: StaffTableProps) {
  const queryClient = useQueryClient()

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/staff/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] }),
  })

  const columns = [
    {
      key: 'fullName',
      header: 'Nhân viên',
      render: (row: Staff) => (
        <div>
          <p className="font-medium text-gray-900">{row.fullName}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (row: Staff) => <span className="text-gray-600">{row.phone}</span>,
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (row: Staff) => <StaffRoleBadge role={row.role} />,
    },
    {
      key: 'branchName',
      header: 'Chi nhánh',
      render: (row: Staff) => <span className="text-gray-600">{row.branchName}</span>,
    },
    {
      key: 'createdAt',
      header: 'Ngày vào',
      render: (row: Staff) => <span className="text-xs text-gray-400">{formatDate(row.createdAt)}</span>,
    },
    {
      key: 'isActive',
      header: 'Trạng thái',
      render: (row: Staff) => <ActiveBadge isActive={row.isActive} />,
    },
    {
      key: 'actions',
      header: '',
      width: '100px',
      render: (row: Staff) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => toggleMutation.mutate({ id: row.id, isActive: !row.isActive })}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title={row.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
          >
            {row.isActive ? <ToggleRight size={16} className="text-green-500" /> : <ToggleLeft size={16} />}
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Chỉnh sửa"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={staff}
      loading={loading}
      emptyText="Không có nhân viên nào"
    />
  )
}
