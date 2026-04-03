'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  CalendarCheck,
  Sparkles,
  Package,
  Users,
  UserCog,
  BarChart3,
  Flower2,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Đặt lịch', href: '/admin/bookings', icon: CalendarCheck },
  { label: 'Dịch vụ', href: '/admin/services', icon: Sparkles },
  { label: 'Sản phẩm', href: '/admin/products', icon: Package },
  { label: 'Khách hàng', href: '/admin/customers', icon: Users },
  { label: 'Nhân viên', href: '/admin/staff', icon: UserCog },
  { label: 'Báo cáo', href: '/admin/reports', icon: BarChart3 },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 shadow-sm z-30 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
          <Flower2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm leading-tight">Láng Spa</p>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
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

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">© 2026 Láng Spa</p>
      </div>
    </aside>
  )
}
