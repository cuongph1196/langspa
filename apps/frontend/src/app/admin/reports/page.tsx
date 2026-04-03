'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, Award, MapPin, CheckCircle, XCircle } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { RevenueDataPoint, ServiceStats, BranchStats, ReportSummary } from '@/types/admin'
import PageHeader from '@/components/admin/shared/PageHeader'
import StatCard from '@/components/admin/shared/StatCard'

type Period = '7d' | '30d' | '3m' | '12m'

function BarChart({ data, maxRevenue }: { data: RevenueDataPoint[]; maxRevenue: number }) {
  return (
    <div>
      <div className="flex items-end gap-2 h-36 mb-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-gray-400 font-medium">{formatPrice(d.revenue).replace(' ₫', '')}</span>
            <div
              className="w-full bg-primary-200 hover:bg-primary-400 rounded-t-lg transition-colors cursor-default"
              style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}px` }}
              title={`${d.date}: ${formatPrice(d.revenue)} · ${d.bookings} lịch`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center">
            <span className="text-[10px] text-gray-400">{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AdminReportsPage() {
  const [period, setPeriod] = useState<Period>('7d')

  const { data: summary = { totalRevenue: 0, totalBookings: 0, completedBookings: 0, cancelledBookings: 0, averageOrderValue: 0, completionRate: 0 } } = useQuery({
    queryKey: ['admin', 'reports', 'summary', period],
    queryFn: () => api.get<{ data: ReportSummary }>(`/admin/reports/summary?period=${period}`).then((r) => r.data.data),
  })
  const { data: revenueData = [] } = useQuery({
    queryKey: ['admin', 'reports', 'revenue', period],
    queryFn: () => api.get<{ data: RevenueDataPoint[] }>(`/admin/reports/revenue?period=${period}`).then((r) => r.data.data),
  })
  const { data: topServices = [] } = useQuery({
    queryKey: ['admin', 'reports', 'top-services', period],
    queryFn: () => api.get<{ data: ServiceStats[] }>(`/admin/reports/top-services?period=${period}`).then((r) => r.data.data),
  })
  const { data: branchStats = [] } = useQuery({
    queryKey: ['admin', 'reports', 'branches', period],
    queryFn: () => api.get<{ data: BranchStats[] }>(`/admin/reports/branches?period=${period}`).then((r) => r.data.data),
  })
  const maxRevenue = revenueData.length > 0 ? Math.max(...revenueData.map((d) => d.revenue)) : 0

  const periodLabels: Record<Period, string> = {
    '7d': '7 ngày qua',
    '30d': '30 ngày qua',
    '3m': '3 tháng qua',
    '12m': '12 tháng qua',
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Báo cáo & Thống kê"
        description="Tổng quan hiệu quả kinh doanh"
        actions={
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  period === p ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {p === '7d' ? '7 ngày' : p === '30d' ? '30 ngày' : p === '3m' ? '3 tháng' : '12 tháng'}
              </button>
            ))}
          </div>
        }
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Tổng doanh thu"
          value={formatPrice(summary.totalRevenue)}
          delta={8}
          deltaLabel="so với kỳ trước"
          icon={<TrendingUp className="text-green-600" size={20} />}
          iconBg="bg-green-50"
        />
        <StatCard
          title="Tổng đặt lịch"
          value={summary.totalBookings}
          delta={5}
          deltaLabel="so với kỳ trước"
          icon={<CheckCircle className="text-blue-500" size={20} />}
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Giá trị TB / lịch"
          value={formatPrice(summary.averageOrderValue)}
          icon={<Award className="text-yellow-500" size={20} />}
          iconBg="bg-yellow-50"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${summary.completionRate}%`}
          delta={2}
          deltaLabel="so với kỳ trước"
          icon={<CheckCircle className="text-primary-500" size={20} />}
          iconBg="bg-primary-50"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900">Doanh thu theo ngày</h2>
              <p className="text-sm text-gray-400 mt-0.5">{periodLabels[period]}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">{formatPrice(summary.totalRevenue)}</p>
              <p className="text-xs text-green-500 font-medium">▲ 8% so với kỳ trước</p>
            </div>
          </div>
          <BarChart data={revenueData} maxRevenue={maxRevenue} />
        </div>

        {/* Completion rate */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Trạng thái đặt lịch</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-1.5 text-green-600"><CheckCircle size={14} /> Hoàn thành</span>
                <span className="font-semibold">{summary.completedBookings}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-green-400 rounded-full"
                  style={{ width: `${(summary.completedBookings / summary.totalBookings) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="flex items-center gap-1.5 text-red-500"><XCircle size={14} /> Đã hủy</span>
                <span className="font-semibold">{summary.cancelledBookings}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full">
                <div
                  className="h-2 bg-red-300 rounded-full"
                  style={{ width: `${(summary.cancelledBookings / summary.totalBookings) * 100}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">Tỷ lệ hoàn thành</p>
              <p className="text-3xl font-bold text-center text-primary-600 mt-1">{summary.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top services */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" size={18} />
            Top dịch vụ phổ biến
          </h2>
          <div className="space-y-3">
            {topServices.map((s, i) => (
              <div key={s.serviceId} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                  i === 0 ? 'bg-yellow-100 text-yellow-700' :
                  i === 1 ? 'bg-gray-100 text-gray-600' :
                  i === 2 ? 'bg-orange-50 text-orange-500' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.serviceName}</p>
                  <p className="text-xs text-gray-400">{s.totalBookings} lịch · {formatPrice(s.totalRevenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="text-blue-500" size={18} />
            Thống kê theo chi nhánh
          </h2>
          <div className="space-y-4">
            {branchStats.map((b) => (
              <div key={b.branchId}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-800">{b.branchName}</span>
                  <span className="text-gray-500">{b.totalBookings} lịch · {formatPrice(b.totalRevenue)}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 bg-primary-300 rounded-full"
                    style={{ width: `${b.completionRate}%` }}
                    title={`Hoàn thành: ${b.completionRate}%`}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-0.5">Hoàn thành: {b.completionRate}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
