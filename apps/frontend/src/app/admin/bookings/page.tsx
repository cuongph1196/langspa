'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Download } from 'lucide-react'
import api from '@/lib/api'
import { AdminBooking } from '@/types/admin'
import { BookingStatus } from '@/types/booking'
import PageHeader from '@/components/admin/shared/PageHeader'
import BookingTable from '@/components/admin/bookings/BookingTable'

const statusOptions: { value: '' | BookingStatus; label: string }[] = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
]

export default function AdminBookingsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'' | BookingStatus>('')
  const [dateFilter, setDateFilter] = useState('')

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: () =>
      api
        .get<{ data: { items: AdminBooking[]; total: number } }>('/admin/bookings')
        .then((r) => r.data.data.items),
  })
  const filtered = bookings.filter((b) => {
    const matchSearch =
      !search ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.customerPhone.includes(search)
    const matchStatus = !statusFilter || b.status === statusFilter
    const matchDate = !dateFilter || b.bookingDate === dateFilter
    return matchSearch && matchStatus && matchDate
  })
  function exportCSV() {
    const headers = ['Khách hàng', 'SĐT', 'Dịch vụ', 'Chi nhánh', 'Ngày', 'Giờ', 'Trạng thái']
    const rows = filtered.map((b) => [
      b.customerName, b.customerPhone, b.serviceName,
      b.branchName, b.bookingDate, b.timeSlot, b.status,
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dat-lich-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <PageHeader
        title="Quản lý Đặt lịch"
        description={`${filtered.length} đặt lịch`}
        actions={
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Download size={15} />
            Xuất CSV
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as '' | BookingStatus)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <BookingTable bookings={filtered} loading={isLoading} />
      </div>
    </div>
  )
}
