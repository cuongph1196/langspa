'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Package,
  Users,
  UserCog,
  BarChart3,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { getRoleDisplayName } from '@/lib/auth'
import { UserRole } from '@/types/user'

// Định nghĩa menu với requiredRole (null = mọi STAFF đều thấy)
const navItems: {
  label: string
  href: string
  icon: React.ElementType
  exact?: boolean
  requiredRole: UserRole | null
}[] = [
  { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard, exact: true, requiredRole: null },
  { label: 'Đặt lịch', href: '/admin/bookings', icon: CalendarCheck, requiredRole: null },         // STAFF trở lên
  { label: 'Dịch vụ', href: '/admin/services', icon: Sparkles, requiredRole: 'MANAGER' },          // MANAGER trở lên
  { label: 'Sản phẩm', href: '/admin/products', icon: Package, requiredRole: 'MANAGER' },
  { label: 'Khách hàng', href: '/admin/customers', icon: Users, requiredRole: 'MANAGER' },
  { label: 'Nhân viên', href: '/admin/staff', icon: UserCog, requiredRole: 'MANAGER' },
  { label: 'Báo cáo', href: '/admin/reports', icon: BarChart3, requiredRole: 'MANAGER' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth, hasRole } = useAuthStore()

  // Đăng xuất và xóa auth state
  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  // Lọc menu theo quyền của user
  const visibleItems = navItems.filter((item) => {
    if (!item.requiredRole) return true  // Mặc định mọi STAFF đều thấy
    return hasRole(item.requiredRole)
  })

  // Tên vai trò hiển thị (dùng helper từ lib/auth)
  const roleLabel = user ? getRoleDisplayName(user.role, user.type) : ''

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 shadow-sm z-30 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <Image
          src="/logo/logo-dark.png"
          alt="Láng Beauty & Spa"
          width={56}
          height={56}
          className="h-12 w-12 object-contain"
          priority
        />
        <div className="min-w-0">
          <p className="font-bold text-ink-800 text-sm leading-tight truncate">Láng Beauty & Spa</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Thông tin user */}
      {user && (
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-medium text-gray-700 truncate">{user.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">{roleLabel}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {visibleItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'w-4.5 h-4.5 shrink-0',
                  isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'
                )}
                size={18}
              />
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary-400" size={14} />}
            </Link>
          )
        })}
      </nav>

      {/* Đăng xuất */}
      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
