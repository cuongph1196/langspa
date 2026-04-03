'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, Clock, DollarSign } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Service } from '@/types/service'
import PageHeader from '@/components/admin/shared/PageHeader'
import { ActiveBadge } from '@/components/admin/shared/StatusBadge'
import ConfirmModal from '@/components/admin/shared/ConfirmModal'
import ServiceForm from '@/components/admin/services/ServiceForm'

export default function AdminServicesPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editService, setEditService] = useState<Service | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['admin', 'services'],
    queryFn: () => api.get<{ data: { items: Service[]; total: number } }>('/admin/services').then((r) => r.data.data.items),
  })

  const categories = useMemo(
    () => [...new Set(services.map((s) => s.category).filter(Boolean))],
    [services],
  )

  const filtered = services.filter((s) => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !selectedCategory || s.category === selectedCategory
    return matchSearch && matchCat
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
      setDeleteId(null)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/services/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'services'] }),
  })

  return (
    <div>
      <PageHeader
        title="Quản lý Dịch vụ"
        description={`${filtered.length} dịch vụ`}
        actions={
          <button
            onClick={() => { setEditService(undefined); setFormOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Thêm dịch vụ
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Tìm dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-40 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={service.imageUrl}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <ActiveBadge isActive={service.isActive} />
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-primary-500 font-medium mb-1">{service.category}</p>
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{service.name}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  {formatPrice(service.price)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {service.duration} phút
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMutation.mutate({ id: service.id, isActive: !service.isActive })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  title={service.isActive ? 'Tắt dịch vụ' : 'Bật dịch vụ'}
                >
                  {service.isActive ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                </button>
                <button
                  onClick={() => { setEditService(service); setFormOpen(true) }}
                  className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(service.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors ml-auto"
                  title="Xóa"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ServiceForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        service={editService}
        categories={categories}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Xóa dịch vụ"
        message="Dịch vụ sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?"
        confirmLabel="Xóa"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
