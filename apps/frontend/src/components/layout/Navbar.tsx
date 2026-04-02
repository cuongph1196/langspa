'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Trang chủ' },
  { href: '/services', label: 'Dịch vụ' },
  { href: '/booking', label: 'Đặt lịch' },
  { href: '/shop', label: 'Cửa hàng' },
  { href: '/blog', label: 'Blog' },
  { href: '/branches', label: 'Chi nhánh' },
  { href: '/contact', label: 'Liên hệ' },
]

// Navbar với highlight active route
export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        'hidden md:flex items-center gap-6 transition-all',
        scrolled ? 'gap-4' : 'gap-6',
      )}
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'font-medium text-sm transition-colors',
            pathname === link.href
              ? 'text-primary-600 font-semibold'
              : 'text-gray-600 hover:text-primary-600',
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
