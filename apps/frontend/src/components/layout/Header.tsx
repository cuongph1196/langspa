'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Flower2 } from 'lucide-react'

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
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <Link
              href="/login"
              className="text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href="/booking"
              className="btn-primary text-sm py-2 px-5"
            >
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
