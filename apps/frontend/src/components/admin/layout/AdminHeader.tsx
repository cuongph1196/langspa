'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Bell, ChevronDown, LogOut, User, Mail, Shield } from 'lucide-react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

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

const roleLabels: Record<string, string> = {
  MANAGER: 'Quản lý',
  TECHNICIAN: 'Kỹ thuật viên',
  RECEPTIONIST: 'Lễ tân',
  CASHIER: 'Thu ngân',
  CUSTOMER: 'Khách hàng',
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

function decodeToken(token: string): { fullName?: string; email?: string; role?: string } {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { fullName: payload.fullName, email: payload.email, role: payload.role }
  } catch {
    return {}
  }
}

export default function AdminHeader() {
  const router = useRouter()
  const breadcrumbs = useBreadcrumb()
  const [menuOpen, setMenuOpen] = useState(false)

  const profile = useMemo(() => {
    if (typeof window === 'undefined') return {}
    const token = localStorage.getItem('access_token')
    return token ? decodeToken(token) : {}
  }, [])

  const initials = profile.fullName
    ? profile.fullName.split(' ').slice(-2).map((w: string) => w[0]).join('').toUpperCase()
    : 'AD'

  function handleLogout() {
    localStorage.removeItem('access_token')
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
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Profile menu */}
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
                {profile.fullName ?? 'Admin'}
              </p>
              {profile.role && (
                <p className="text-xs text-gray-400 leading-tight">
                  {roleLabels[profile.role] ?? profile.role}
                </p>
              )}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                {/* Profile info card */}
                <div className="px-4 py-4 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-700">{initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {profile.fullName ?? 'Admin'}
                      </p>
                      {profile.email && (
                        <p className="text-xs text-gray-400 truncate flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />
                          {profile.email}
                        </p>
                      )}
                      {profile.role && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                          <Shield className="w-3 h-3" />
                          {roleLabels[profile.role] ?? profile.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
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
