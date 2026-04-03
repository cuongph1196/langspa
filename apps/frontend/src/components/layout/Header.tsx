'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Flower2, ChevronDown, LogOut, Mail, Shield, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { getRoleDisplayName } from '@/lib/auth'

// Danh sách menu điều hướng
const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/services', label: 'Dịch vụ' },
  { href: '/booking', label: 'Đặt lịch' },
  { href: '/shop', label: 'Cửa hàng' },
  { href: '/blog', label: 'Blog' },
  { href: '/branches', label: 'Chi nhánh' },
  { href: '/contact', label: 'Liên hệ' },
]

export default function Header() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, clearAuth, isStaff } = useAuthStore()

  const initials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : ''

  const roleLabel = user ? getRoleDisplayName(user.role, user.type) : ''

  function handleLogout() {
    clearAuth()
    setProfileOpen(false)
    router.replace('/')
  }

  const isLoggedIn = !!user

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Flower2 className="h-7 w-7 text-primary-600 group-hover:text-primary-700 transition-colors" />
            <span className="font-serif text-xl font-bold text-primary-700">
              Láng Spa
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Nút hành động */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((o) => !o)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-pink-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary-700">{initials}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-800 leading-tight">
                      {user?.email}
                    </p>
                    {roleLabel && (
                      <p className="text-xs text-gray-400 leading-tight">{roleLabel}</p>
                    )}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                      {/* Profile info */}
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

                      {/* Actions */}
                      <div className="py-1">
                        {/* Nhân viên được vào trang quản trị */}
                        {isStaff() && (
                          <Link
                            href="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary-500" />
                            Trang quản trị
                          </Link>
                        )}
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
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                Đăng nhập
              </Link>
            )}
            <Link href="/booking" className="btn-primary text-sm py-2 px-5">
              Đặt lịch
            </Link>
          </div>

          {/* Hamburger menu (mobile) */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-pink-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-pink-100 px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/login"
              className="text-center text-gray-600 font-medium py-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Đăng nhập
            </Link>
            <Link
              href="/booking"
              className="btn-primary text-center text-sm"
              onClick={() => setIsMenuOpen(false)}
            >
              Đặt lịch ngay
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
