'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import api from '@/lib/api'
import { Service } from '@/types/service'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface ServiceFormData {
  name: string
  description: string
  price: number
  duration: number
  category: string
  imageUrl: string
}

interface ServiceFormProps {
  isOpen: boolean
  onClose: () => void
  service?: Service
  categories: string[]
}

export default function ServiceForm({ isOpen, onClose, service, categories }: ServiceFormProps) {
  const queryClient = useQueryClient()
  const isEdit = !!service

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    defaultValues: service
      ? {
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          category: service.category,
          imageUrl: service.imageUrl,
        }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: ServiceFormData) =>
      isEdit
        ? api.patch(`/admin/services/${service!.id}`, data)
        : api.post('/admin/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      reset()
      onClose()
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Cập nhật dịch vụ' : 'Thêm dịch vụ mới'} size="lg">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        {/* Tên dịch vụ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên dịch vụ <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name', { required: 'Vui lòng nhập tên dịch vụ' })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="VD: Chăm sóc da mặt"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
            placeholder="Mô tả ngắn về dịch vụ..."
          />
        </div>

        {/* Giá & Thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giá (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('price', { required: 'Bắt buộc', min: { value: 1000, message: 'Giá tối thiểu 1.000đ' } })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="350000"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thời gian (phút) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register('duration', { required: 'Bắt buộc', min: { value: 5, message: 'Tối thiểu 5 phút' } })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="60"
            />
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration.message}</p>}
          </div>
        </div>

        {/* Danh mục */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Danh mục <span className="text-red-500">*</span>
          </label>
          <select
            {...register('category', { required: 'Vui lòng chọn danh mục' })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>

        {/* URL ảnh */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
          <input
            {...register('imageUrl')}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="https://..."
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" type="button" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button size="sm" type="submit" className="flex-1" isLoading={mutation.isPending}>
            {isEdit ? 'Cập nhật' : 'Thêm dịch vụ'}
          </Button>
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-sm text-center">Có lỗi xảy ra, vui lòng thử lại.</p>
        )}
      </form>
    </Modal>
  )
}
