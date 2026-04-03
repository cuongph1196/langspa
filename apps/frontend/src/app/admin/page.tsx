'use client'

import { useQuery } from '@tanstack/react-query'
import {
  CalendarCheck,
  DollarSign,
  Users,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { formatPrice, formatDateTime } from '@/lib/utils'
import StatCard from '@/components/admin/shared/StatCard'
import { BookingStatusBadge } from '@/components/admin/shared/StatusBadge'
import { DashboardStats, AdminBooking, RevenueDataPoint } from '@/types/admin'

// ─── Mini bar chart ───────────────────────────────────────────────────────────

function MiniBarChart({ data }: { data: RevenueDataPoint[] }) {
  const max = Math.max(...data.map((d) => d.revenue))
  return (
    <div className="flex items-end gap-2 h-24">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full bg-primary-200 hover:bg-primary-400 rounded-t-md transition-colors cursor-default"
            style={{ height: `${(d.revenue / max) * 80}px` }}
            title={`${d.date}: ${formatPrice(d.revenue)}`}
          />
          <span className="text-[10px] text-gray-400 whitespace-nowrap">{d.date}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { data: stats = { todayBookings: 0, todayBookingsDelta: 0, monthRevenue: 0, monthRevenueDelta: 0, newCustomers: 0, newCustomersDelta: 0, pendingBookings: 0 } } = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => api.get<DashboardStats>('/admin/dashboard/stats').then((r) => r.data),
  })
  const { data: recentBookings = [] } = useQuery({
    queryKey: ['admin', 'dashboard', 'recent-bookings'],
    queryFn: () => api.get<AdminBooking[]>('/admin/dashboard/recent-bookings').then((r) => r.data),
  })
  const { data: revenueData = [] } = useQuery({
    queryKey: ['admin', 'dashboard', 'revenue'],
    queryFn: () => api.get<RevenueDataPoint[]>('/admin/dashboard/revenue?days=7').then((r) => r.data),
  })

  return (
    <div className="space-y-6">
      {/* Alert: Pending bookings */}
      {stats.pendingBookings > 0 && (
        <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
          <AlertCircle className="text-yellow-500 shrink-0" size={18} />
          <p className="text-sm text-yellow-700">
            Có <strong>{stats.pendingBookings}</strong> đặt lịch đang chờ xác nhận.{' '}
            <Link href="/admin/bookings?status=PENDING" className="underline font-semibold">
              Xem ngay
            </Link>
          </p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Đặt lịch hôm nay"
          value={stats.todayBookings}
          delta={stats.todayBookingsDelta}
          icon={<CalendarCheck className="text-primary-600" size={20} />}
          iconBg="bg-primary-50"
        />
        <StatCard
          title="Doanh thu tháng"
          value={formatPrice(stats.monthRevenue)}
          delta={stats.monthRevenueDelta}
          deltaLabel="so với tháng trước"
          icon={<DollarSign className="text-green-600" size={20} />}
          iconBg="bg-green-50"
        />
        <StatCard
          title="Khách hàng mới"
          value={stats.newCustomers}
          delta={stats.newCustomersDelta}
          deltaLabel="so với tháng trước"
          icon={<Users className="text-blue-500" size={20} />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Chờ xác nhận"
          value={stats.pendingBookings}
          icon={<Clock className="text-yellow-500" size={20} />}
          iconBg="bg-yellow-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Doanh thu 7 ngày qua</h2>
              <p className="text-sm text-gray-400 mt-0.5">Biến động theo ngày</p>
            </div>
            <Sparkles className="text-primary-400" size={18} />
          </div>
          <MiniBarChart data={revenueData} />
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Truy cập nhanh</h2>
          <div className="space-y-2">
            {[
              { label: 'Quản lý đặt lịch', href: '/admin/bookings', color: 'text-primary-600 bg-primary-50' },
              { label: 'Quản lý dịch vụ', href: '/admin/services', color: 'text-blue-600 bg-blue-50' },
              { label: 'Quản lý khách hàng', href: '/admin/customers', color: 'text-green-600 bg-green-50' },
              { label: 'Báo cáo doanh thu', href: '/admin/reports', color: 'text-orange-600 bg-orange-50' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <span className={`text-sm font-medium ${item.color.split(' ')[0]}`}>{item.label}</span>
                <ArrowRight className="text-gray-300 group-hover:text-gray-500 transition-colors" size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Đặt lịch gần nhất</h2>
          <Link href="/admin/bookings" className="text-sm text-primary-600 hover:underline font-medium">
            Xem tất cả
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Khách hàng', 'Dịch vụ', 'Chi nhánh', 'Thời gian', 'Trạng thái'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-900">{b.customerName}</p>
                    <p className="text-xs text-gray-400">{b.customerPhone}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-gray-700">{b.serviceName}</p>
                    <p className="text-xs text-gray-400">{formatPrice(b.servicePrice)}</p>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{b.branchName}</td>
                  <td className="px-3 py-3 text-gray-600">
                    {b.bookingDate} · {b.timeSlot}
                  </td>
                  <td className="px-3 py-3">
                    <BookingStatusBadge status={b.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
