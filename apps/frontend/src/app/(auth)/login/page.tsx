'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { decodeJwt, getRedirectAfterLogin } from '@/lib/auth'
import { useAuthStore } from '@/store/auth.store'

interface LoginFormData {
  email: string
  password: string
}

// Trang đăng nhập
export default function LoginPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', data)
      const access_token: string = res.data.data?.access_token ?? res.data.access_token

      // Decode JWT để lấy thông tin user (type, role)
      const authUser = decodeJwt(access_token)
      if (authUser) {
        useAuthStore.getState().setAuth(authUser, access_token)
        router.push(getRedirectAfterLogin(authUser))
      } else {
        // Fallback nếu không decode được token
        localStorage.setItem('access_token', access_token)
        router.push('/admin')
      }
    } catch {
      setError('Email hoặc mật khẩu không đúng.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/logo/logo-dark.png"
              alt="Láng Beauty & Spa"
              width={128}
              height={128}
              className="h-24 w-24 sm:h-28 sm:w-28 mx-auto mb-4 object-contain"
              priority
            />
            <h1 className="font-serif text-2xl font-bold text-ink-800">Láng Beauty & Spa</h1>
            <p className="text-gray-500 mt-2 text-sm">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Thông báo lỗi */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' },
                })}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register('password', {
                  required: 'Vui lòng nhập mật khẩu',
                  minLength: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự' },
                })}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Phân cách */}
          {/* <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm">hoặc</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div> */}

          {/* Đăng nhập Google (UI only) */}
          {/* <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-full text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập với Google
          </button> */}
        </div>
      </div>
    </div>
  )
}
