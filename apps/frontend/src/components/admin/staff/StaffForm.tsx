'use client'

import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import { Staff, StaffRole } from '@/types/admin'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface StaffFormData {
  fullName: string
  phone: string
  email: string
  role: StaffRole
  branchId: string
}

interface StaffFormProps {
  isOpen: boolean
  onClose: () => void
  staff?: Staff
}

export default function StaffForm({ isOpen, onClose, staff }: StaffFormProps) {
  const queryClient = useQueryClient()
  const isEdit = !!staff
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffFormData>({
    defaultValues: staff
      ? { fullName: staff.fullName, phone: staff.phone, email: staff.email, role: staff.role, branchId: staff.branchId }
      : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: StaffFormData) =>
      isEdit ? api.patch(`/admin/staff/${staff!.id}`, data) : api.post('/admin/staff', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'staff'] })
      reset()
      onClose()
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên'} size="md">
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            {...register('fullName', { required: 'Bắt buộc' })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="Nguyễn Thị A"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone', {
                required: 'Bắt buộc',
                pattern: { value: /^(0[3|5|7|8|9])+([0-9]{8})$/, message: 'SĐT không hợp lệ' },
              })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="09xxxxxxxx"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email', { required: 'Bắt buộc' })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="email@langspa.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò <span className="text-red-500">*</span>
            </label>
            <select
              {...register('role', { required: 'Bắt buộc' })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            >
              <option value="">-- Chọn --</option>
              <option value="TECHNICIAN">Kỹ thuật viên</option>
              <option value="RECEPTIONIST">Lễ tân</option>
              <option value="MANAGER">Quản lý</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chi nhánh <span className="text-red-500">*</span>
            </label>
            <select
              {...register('branchId', { required: 'Bắt buộc' })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
            >
              <option value="">-- Chọn --</option>
              <option value="b1">Đống Đa</option>
              <option value="b2">Cầu Giấy</option>
              <option value="b3">Hoàn Kiếm</option>
            </select>
            {errors.branchId && <p className="text-red-500 text-xs mt-1">{errors.branchId.message}</p>}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" type="button" className="flex-1" onClick={onClose}>
            Hủy
          </Button>
          <Button size="sm" type="submit" className="flex-1" isLoading={mutation.isPending}>
            {isEdit ? 'Cập nhật' : 'Thêm nhân viên'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
