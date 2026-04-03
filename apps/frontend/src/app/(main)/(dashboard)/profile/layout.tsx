'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'

// Layout bảo vệ trang profile — yêu cầu đăng nhập
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { token } = useAuthStore()

  useEffect(() => {
    if (!token) {
      router.replace('/login')
    }
  }, [token, router])

  return <>{children}</>
}
