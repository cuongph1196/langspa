'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X, UserCheck, Download } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice, formatDate } from '@/lib/utils'
import { AdminBooking, UpdateBookingStatusDto } from '@/types/admin'
import { BookingStatus } from '@/types/booking'
import DataTable from '@/components/admin/shared/DataTable'
import { BookingStatusBadge } from '@/components/admin/shared/StatusBadge'
import ConfirmModal from '@/components/admin/shared/ConfirmModal'

interface BookingTableProps {
  bookings: AdminBooking[]
  loading?: boolean
}

export default function BookingTable({ bookings, loading }: BookingTableProps) {
  const queryClient = useQueryClient()
  const [confirmAction, setConfirmAction] = useState<{
    bookingId: string
    status: BookingStatus
    label: string
  } | null>(null)

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateBookingStatusDto }) =>
      api.patch(`/admin/bookings/${id}/status`, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      setConfirmAction(null)
    },
  })

  function openConfirm(bookingId: string, status: BookingStatus, label: string) {
    setConfirmAction({ bookingId, status, label })
  }

  const columns = [
    {
      key: 'customerName',
      header: 'Khách hàng',
      render: (row: AdminBooking) => (
        <div>
          <p className="font-medium text-gray-900">{row.customerName}</p>
          <p className="text-xs text-gray-400">{row.customerPhone}</p>
        </div>
      ),
    },
    {
      key: 'serviceName',
      header: 'Dịch vụ',
      render: (row: AdminBooking) => (
        <div>
          <p className="text-gray-700">{row.serviceName}</p>
          <p className="text-xs text-gray-400">{formatPrice(row.servicePrice)}</p>
        </div>
      ),
    },
    {
      key: 'branchName',
      header: 'Chi nhánh',
      render: (row: AdminBooking) => <span className="text-gray-600">{row.branchName}</span>,
    },
    {
      key: 'bookingDate',
      header: 'Ngày giờ',
      render: (row: AdminBooking) => (
        <div>
          <p className="text-gray-700">{formatDate(row.bookingDate)}</p>
          <p className="text-xs text-gray-400">{row.timeSlot}</p>
        </div>
      ),
    },
    {
      key: 'staffName',
      header: 'KTV',
      render: (row: AdminBooking) => (
        <span className="text-gray-500 text-xs">{row.staffName ?? '—'}</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row: AdminBooking) => <BookingStatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Hành động',
      width: '140px',
      render: (row: AdminBooking) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'PENDING' && (
            <button
              onClick={() => openConfirm(row.id, 'CONFIRMED', 'xác nhận')}
              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
              title="Xác nhận"
            >
              <Check size={14} />
            </button>
          )}
          {row.status === 'CONFIRMED' && (
            <button
              onClick={() => openConfirm(row.id, 'COMPLETED', 'hoàn thành')}
              className="p-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-600 transition-colors"
              title="Hoàn thành"
            >
              <UserCheck size={14} />
            </button>
          )}
          {(row.status === 'PENDING' || row.status === 'CONFIRMED') && (
            <button
              onClick={() => openConfirm(row.id, 'CANCELLED', 'hủy')}
              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
              title="Hủy"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable columns={columns} data={bookings} loading={loading} emptyText="Không có đặt lịch nào" />

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() =>
          confirmAction &&
          updateMutation.mutate({
            id: confirmAction.bookingId,
            dto: { status: confirmAction.status },
          })
        }
        title={`Xác nhận ${confirmAction?.label}`}
        message={`Bạn có chắc chắn muốn ${confirmAction?.label} đặt lịch này không?`}
        confirmLabel={`${confirmAction?.label?.charAt(0).toUpperCase()}${confirmAction?.label?.slice(1)}`}
        variant={confirmAction?.status === 'CANCELLED' ? 'danger' : 'warning'}
        loading={updateMutation.isPending}
      />
    </>
  )
}
