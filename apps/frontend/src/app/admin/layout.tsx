'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/layout/AdminSidebar'
import AdminHeader from '@/components/admin/layout/AdminHeader'
import { useAuthStore } from '@/store/auth.store'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, token, canAccess, isStaff } = useAuthStore()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Chưa có token → redirect về login
    if (!token) {
      router.replace('/login')
      return
    }

    // Là CUSTOMER → không có quyền vào /admin
    if (user && !isStaff()) {
      router.replace('/profile')
      return
    }

    // Kiểm tra quyền truy cập route hiện tại
    if (user && !canAccess(pathname)) {
      // Redirect về trang đặt lịch (quyền thấp nhất của STAFF)
      router.replace('/admin/bookings')
      return
    }

    setIsChecking(false)
  }, [token, user, pathname, router, canAccess, isStaff])

  // Hiển thị spinner khi đang kiểm tra quyền
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" role="status" aria-label="Đang kiểm tra quyền truy cập">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <span className="sr-only">Đang tải...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-60 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
