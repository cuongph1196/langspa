import { BookingStatus } from '@/types/booking'
import { MembershipLevel } from '@/types/user'
import { StaffRole } from '@/types/admin'
import { cn } from '@/lib/utils'

// ─── Booking Status Badge ─────────────────────────────────────────────────────

const bookingStatusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Chờ xác nhận', className: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Đã xác nhận',  className: 'bg-blue-100   text-blue-700'   },
  COMPLETED: { label: 'Hoàn thành',   className: 'bg-green-100  text-green-700'  },
  CANCELLED: { label: 'Đã hủy',       className: 'bg-red-100    text-red-600'    },
}

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = bookingStatusConfig[status]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  )
}

// ─── Membership Badge ─────────────────────────────────────────────────────────

const membershipConfig: Record<MembershipLevel, { label: string; className: string }> = {
  STANDARD: { label: 'Thường',  className: 'bg-gray-100   text-gray-600'    },
  SILVER:   { label: 'Bạc',     className: 'bg-gray-200   text-gray-700'    },
  GOLD:     { label: 'Vàng',    className: 'bg-yellow-100 text-yellow-700'  },
  VIP:      { label: 'VIP',     className: 'bg-primary-100 text-primary-700' },
}

interface MembershipBadgeProps {
  level: MembershipLevel
  className?: string
}

export function MembershipBadge({ level, className }: MembershipBadgeProps) {
  const config = membershipConfig[level]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', config.className, className)}>
      {config.label}
    </span>
  )
}

// ─── Staff Role Badge ─────────────────────────────────────────────────────────

const roleConfig: Record<StaffRole, { label: string; className: string }> = {
  TECHNICIAN:   { label: 'Kỹ thuật viên', className: 'bg-purple-100 text-purple-700' },
  RECEPTIONIST: { label: 'Lễ tân',        className: 'bg-blue-100   text-blue-700'   },
  MANAGER:      { label: 'Quản lý',       className: 'bg-orange-100 text-orange-700' },
  CASHIER:      { label: 'Thu ngân',      className: 'bg-teal-100   text-teal-700'   },
}

interface StaffRoleBadgeProps {
  role: StaffRole
  className?: string
}

export function StaffRoleBadge({ role, className }: StaffRoleBadgeProps) {
  const config = roleConfig[role]
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', config.className, className)}>
      {config.label}
    </span>
  )
}

// ─── Active / Inactive Badge ──────────────────────────────────────────────────

interface ActiveBadgeProps {
  isActive: boolean
}

export function ActiveBadge({ isActive }: ActiveBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-green-500' : 'bg-gray-400')} />
      {isActive ? 'Hoạt động' : 'Tắt'}
    </span>
  )
}
