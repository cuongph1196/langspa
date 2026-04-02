'use client'

import { useState } from 'react'
import { formatDate, formatPrice } from '@/lib/utils'
import type { BookingStatus } from '@/types/booking'
import type { MembershipLevel } from '@/types/user'

// Màu sắc trạng thái đặt lịch
const statusColors: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

const statusLabels: Record<BookingStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
}

// Màu hạng thành viên
const membershipColors: Record<MembershipLevel, string> = {
  STANDARD: 'bg-gray-100 text-gray-700',
  SILVER: 'bg-gray-200 text-gray-800',
  GOLD: 'bg-yellow-100 text-yellow-700',
  VIP: 'bg-pink-100 text-pink-700',
}

// Dữ liệu mẫu
const mockUser = {
  id: '1',
  fullName: 'Nguyễn Thị Hoa',
  email: 'hoa@example.com',
  phone: '0901234567',
  membershipLevel: 'GOLD' as MembershipLevel,
  points: 1250,
  createdAt: '2024-01-15',
}

const mockBookings = [
  {
    id: '1',
    serviceName: 'Chăm sóc da mặt',
    branchName: 'Láng Spa - Đống Đa',
    bookingDate: '2024-12-20',
    timeSlot: '10:00',
    status: 'COMPLETED' as BookingStatus,
    price: 350000,
  },
  {
    id: '2',
    serviceName: 'Massage thư giãn',
    branchName: 'Láng Spa - Cầu Giấy',
    bookingDate: '2025-01-15',
    timeSlot: '14:30',
    status: 'CONFIRMED' as BookingStatus,
    price: 450000,
  },
]

// Trang hồ sơ cá nhân
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'membership'>('info')

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header profile */}
        <div className="bg-gradient-to-r from-primary-600 to-pink-500 rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {mockUser.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">{mockUser.fullName}</h1>
              <p className="text-white/80 text-sm">{mockUser.email}</p>
              <span
                className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-1 ${membershipColors[mockUser.membershipLevel]}`}
              >
                Hạng {mockUser.membershipLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
          {[
            { key: 'info', label: 'Thông tin' },
            { key: 'bookings', label: 'Lịch hẹn' },
            { key: 'membership', label: 'Thành viên' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'info' | 'bookings' | 'membership')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Thông tin cá nhân */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-800 mb-5">
              Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Họ và tên</label>
                <p className="font-medium text-gray-800">{mockUser.fullName}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <p className="font-medium text-gray-800">{mockUser.email}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Số điện thoại</label>
                <p className="font-medium text-gray-800">{mockUser.phone}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày tham gia</label>
                <p className="font-medium text-gray-800">{formatDate(mockUser.createdAt)}</p>
              </div>
            </div>
            <button className="mt-6 btn-primary text-sm">
              Chỉnh sửa thông tin
            </button>
          </div>
        )}

        {/* Tab: Lịch sử đặt lịch */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-800 mb-5">
              Lịch sử đặt lịch
            </h2>
            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-100 rounded-xl p-4 hover:border-primary-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{booking.serviceName}</h3>
                      <p className="text-gray-500 text-sm">{booking.branchName}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        📅 {formatDate(booking.bookingDate)} lúc {booking.timeSlot}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[booking.status]}`}
                      >
                        {statusLabels[booking.status]}
                      </span>
                      <p className="text-primary-600 font-semibold text-sm mt-2">
                        {formatPrice(booking.price)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Hạng thành viên */}
        {activeTab === 'membership' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-gray-800 mb-5">
              Hạng thành viên & Điểm thưởng
            </h2>

            {/* Điểm tích lũy */}
            <div className="bg-gradient-to-r from-secondary-50 to-yellow-50 rounded-xl p-5 mb-6 border border-secondary-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Điểm tích lũy hiện tại</p>
                  <p className="text-4xl font-bold text-secondary-600 mt-1">
                    {mockUser.points.toLocaleString('vi-VN')}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">điểm</p>
                </div>
                <div className="text-6xl">⭐</div>
              </div>
            </div>

            {/* Hạng thành viên */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['STANDARD', 'SILVER', 'GOLD', 'VIP'] as MembershipLevel[]).map((level) => (
                <div
                  key={level}
                  className={`p-3 rounded-xl text-center border-2 ${
                    mockUser.membershipLevel === level
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="text-2xl mb-1">
                    {level === 'STANDARD' ? '🥉' : level === 'SILVER' ? '🥈' : level === 'GOLD' ? '🥇' : '👑'}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{level}</p>
                  {mockUser.membershipLevel === level && (
                    <p className="text-xs text-primary-600 font-medium mt-1">Hạng hiện tại</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
