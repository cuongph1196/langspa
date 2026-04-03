import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  delta?: number        // % thay đổi so với kỳ trước
  deltaLabel?: string   // ví dụ: "so với tháng trước"
  icon: ReactNode
  iconBg?: string
  loading?: boolean
}

export default function StatCard({
  title,
  value,
  delta,
  deltaLabel = 'so với hôm qua',
  icon,
  iconBg = 'bg-primary-50',
  loading = false,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-8 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    )
  }

  const isPositive = delta !== undefined && delta > 0
  const isNegative = delta !== undefined && delta < 0

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', iconBg)}>
          {icon}
        </div>
      </div>

      <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>

      {delta !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-semibold',
              isPositive && 'text-green-600',
              isNegative && 'text-red-500',
              !isPositive && !isNegative && 'text-gray-400'
            )}
          >
            {isPositive && <TrendingUp size={12} />}
            {isNegative && <TrendingDown size={12} />}
            {!isPositive && !isNegative && <Minus size={12} />}
            {isPositive && '+'}
            {delta}%
          </span>
          <span className="text-xs text-gray-400">{deltaLabel}</span>
        </div>
      )}
    </div>
  )
}
