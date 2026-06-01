'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { CreateBookingDto } from '@/types/booking'
import api from '@/lib/api'

// Dữ liệu mẫu chi nhánh
const branches = [
  { id: '1', name: 'Láng Beauty & Spa - Đống Đa' },
  { id: '2', name: 'Láng Beauty & Spa - Cầu Giấy' },
  { id: '3', name: 'Láng Beauty & Spa - Hoàn Kiếm' },
]

// Khung giờ có sẵn
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

// Form đặt lịch 3 bước
export default function BookingForm({ serviceId }: { serviceId?: string }) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<CreateBookingDto>({
    defaultValues: { serviceId: serviceId || '' },
  })

  // Chuyển sang bước tiếp theo với validation
  const nextStep = async () => {
    let fieldsToValidate: (keyof CreateBookingDto)[] = []
    if (step === 1) fieldsToValidate = ['serviceId', 'branchId']
    if (step === 2) fieldsToValidate = ['bookingDate', 'timeSlot']

    const isValid = await trigger(fieldsToValidate)
    if (isValid) setStep(step + 1)
  }

  const prevStep = () => setStep(step - 1)

  // Gửi form đặt lịch
  const onSubmit = async (data: CreateBookingDto) => {
    setIsSubmitting(true)
    try {
      await api.post('/bookings', data)
      setIsSuccess(true)
    } catch (error) {
      console.error('Lỗi đặt lịch:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Hiển thị thông báo thành công
  if (isSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h3 className="font-serif text-2xl font-bold text-green-700 mb-2">
          Đặt lịch thành công!
        </h3>
        <p className="text-green-600">
          Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong vòng 30 phút. Cảm ơn bạn!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Thanh tiến trình */}
      <div className="flex items-center justify-between mb-8">
        {['Chọn dịch vụ', 'Chọn thời gian', 'Thông tin'].map((label, i) => (
          <div key={i} className="flex items-center">
            <div className={`flex flex-col items-center ${i < 2 ? 'flex-1' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step > i + 1
                    ? 'bg-green-500 text-white'
                    : step === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className="text-xs mt-1 text-gray-500 hidden sm:block">{label}</span>
            </div>
            {i < 2 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  step > i + 1 ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Bước 1: Chọn dịch vụ và chi nhánh */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">
              Chọn dịch vụ & chi nhánh
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dịch vụ <span className="text-red-500">*</span>
              </label>
              <select
                {...register('serviceId', { required: 'Vui lòng chọn dịch vụ' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">-- Chọn dịch vụ --</option>
                <option value="1">Chăm sóc da mặt - 350.000đ</option>
                <option value="2">Massage thư giãn - 450.000đ</option>
                <option value="3">Triệt lông - 500.000đ</option>
                <option value="4">Trị liệu tóc - 280.000đ</option>
              </select>
              {errors.serviceId && (
                <p className="text-red-500 text-xs mt-1">{errors.serviceId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chi nhánh <span className="text-red-500">*</span>
              </label>
              <select
                {...register('branchId', { required: 'Vui lòng chọn chi nhánh' })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">-- Chọn chi nhánh --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.branchId && (
                <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Bước 2: Chọn ngày và giờ */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">
              Chọn ngày & giờ
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày hẹn <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('bookingDate', { required: 'Vui lòng chọn ngày' })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.bookingDate && (
                <p className="text-red-500 text-xs mt-1">{errors.bookingDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khung giờ <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <label key={time} className="cursor-pointer">
                    <input
                      type="radio"
                      value={time}
                      {...register('timeSlot', { required: 'Vui lòng chọn giờ' })}
                      className="sr-only"
                    />
                    <span
                      className={`block text-center py-2 px-3 rounded-lg border text-sm transition-colors ${
                        watch('timeSlot') === time
                          ? 'border-primary-500 bg-primary-50 text-primary-600 font-medium'
                          : 'border-gray-200 hover:border-ink-300 hover:bg-ink-50'
                      }`}
                    >
                      {time}
                    </span>
                  </label>
                ))}
              </div>
              {errors.timeSlot && (
                <p className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>
              )}
            </div>
          </div>
        )}

        {/* Bước 3: Thông tin cá nhân */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-4">
              Thông tin của bạn
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Vui lòng nhập họ tên' })}
                placeholder="Nguyễn Thị Hoa"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                {...register('phone', {
                  required: 'Vui lòng nhập số điện thoại',
                  pattern: {
                    value: /^(0|\+84)[3-9][0-9]{8}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                })}
                placeholder="0901234567"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Email không hợp lệ',
                  },
                })}
                placeholder="email@example.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú (không bắt buộc)
              </label>
              <textarea
                {...register('notes')}
                placeholder="Yêu cầu đặc biệt, dị ứng da liễu..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        )}

        {/* Nút điều hướng */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-600 rounded-full font-semibold hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 btn-primary"
            >
              Tiếp theo →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang gửi...' : '✓ Xác nhận đặt lịch'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
