'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut, Mail, Shield } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { getRoleDisplayName } from '@/lib/auth'

// Tên breadcrumb theo path segment
const breadcrumbMap: Record<string, string> = {
  admin: 'Tổng quan',
  bookings: 'Đặt lịch',
  services: 'Dịch vụ',
  products: 'Sản phẩm',
  customers: 'Khách hàng',
  staff: 'Nhân viên',
  reports: 'Báo cáo',
}

function useBreadcrumb() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg, i) => ({
    label: breadcrumbMap[seg] ?? seg,
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }))
}

export default function AdminHeader() {
  const router = useRouter()
  const breadcrumbs = useBreadcrumb()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, clearAuth } = useAuthStore()

  // Lấy chữ viết tắt từ email (vd: admin@spa.com → AD)
  const initials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : 'AD'

  const roleLabel = user ? getRoleDisplayName(user.role, user.type) : ''

  function handleLogout() {
    clearAuth()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-20 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={crumb.href} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">/</span>}
            <span className={cn(crumb.isLast ? 'text-gray-900 font-semibold' : 'text-gray-400')}>
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Chuông thông báo */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Menu hồ sơ */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-primary-700">{initials}</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {user?.email ?? 'Admin'}
              </p>
              {roleLabel && (
                <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                {/* Thông tin hồ sơ */}
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-700">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      {user?.email && (
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          {user.email}
                        </p>
                      )}
                      {roleLabel && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                          <Shield className="w-3 h-3" />
                          {roleLabel}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hành động */}
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
