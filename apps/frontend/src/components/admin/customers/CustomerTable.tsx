'use client'

import { Eye, Star } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { AdminCustomer } from '@/types/admin'
import DataTable from '@/components/admin/shared/DataTable'
import { MembershipBadge } from '@/components/admin/shared/StatusBadge'

interface CustomerTableProps {
  customers: AdminCustomer[]
  loading?: boolean
  onSelect: (customer: AdminCustomer) => void
}

export default function CustomerTable({ customers, loading, onSelect }: CustomerTableProps) {
  const columns = [
    {
      key: 'fullName',
      header: 'Khách hàng',
      render: (row: AdminCustomer) => (
        <div>
          <p className="font-medium text-gray-900">{row.fullName}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Số điện thoại',
      render: (row: AdminCustomer) => <span className="text-gray-600">{row.phone}</span>,
    },
    {
      key: 'membershipLevel',
      header: 'Hạng',
      render: (row: AdminCustomer) => <MembershipBadge level={row.membershipLevel} />,
    },
    {
      key: 'points',
      header: 'Điểm',
      render: (row: AdminCustomer) => (
        <span className="flex items-center gap-1 text-yellow-600 font-medium text-sm">
          <Star size={12} fill="currentColor" />
          {row.points.toLocaleString('vi-VN')}
        </span>
      ),
    },
    {
      key: 'totalBookings',
      header: 'Tổng đặt lịch',
      render: (row: AdminCustomer) => <span className="text-gray-700">{row.totalBookings}</span>,
    },
    {
      key: 'totalSpent',
      header: 'Chi tiêu',
      render: (row: AdminCustomer) => (
        <span className="text-gray-700 font-medium">{formatPrice(row.totalSpent)}</span>
      ),
    },
    {
      key: 'lastBookingAt',
      header: 'Lần cuối',
      render: (row: AdminCustomer) => (
        <span className="text-xs text-gray-400">
          {row.lastBookingAt ? formatDate(row.lastBookingAt) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '60px',
      render: (row: AdminCustomer) => (
        <button
          onClick={() => onSelect(row)}
          className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          title="Xem chi tiết"
        >
          <Eye size={15} />
        </button>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={customers}
      loading={loading}
      emptyText="Không tìm thấy khách hàng"
    />
  )
}
