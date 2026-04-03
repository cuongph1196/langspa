'use client'

import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Pencil, Trash2, ToggleLeft, ToggleRight, AlertTriangle, Package } from 'lucide-react'
import api from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Product, CreateProductDto } from '@/types/admin'
import PageHeader from '@/components/admin/shared/PageHeader'
import { ActiveBadge } from '@/components/admin/shared/StatusBadge'
import ConfirmModal from '@/components/admin/shared/ConfirmModal'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

const LOW_STOCK_THRESHOLD = 10

interface ProductFormData {
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

function ProductForm({
  isOpen,
  onClose,
  product,
  categories,
}: {
  isOpen: boolean
  onClose: () => void
  product?: Product
  categories: string[]
}) {
  const queryClient = useQueryClient()
  const isEdit = !!product
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product
      ? { name: product.name, description: product.description, price: product.price, stock: product.stock, category: product.category, imageUrl: product.imageUrl }
      : undefined,
  })
  const mutation = useMutation({
    mutationFn: (data: ProductFormData) =>
      isEdit ? api.patch(`/admin/products/${product!.id}`, data) : api.post('/admin/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      reset()
      onClose()
    },
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'} size="lg">
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm <span className="text-red-500">*</span></label>
          <input
            {...register('name', { required: 'Bắt buộc' })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="VD: Kem dưỡng ẩm"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) <span className="text-red-500">*</span></label>
            <input
              type="number"
              {...register('price', { required: 'Bắt buộc', min: { value: 1000, message: 'Tối thiểu 1.000đ' } })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="320000"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho <span className="text-red-500">*</span></label>
            <input
              type="number"
              {...register('stock', { required: 'Bắt buộc', min: { value: 0, message: 'Không được âm' } })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục <span className="text-red-500">*</span></label>
          <select
            {...register('category', { required: 'Bắt buộc' })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL Hình ảnh</label>
          <input
            {...register('imageUrl')}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="https://..."
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="sm" type="button" className="flex-1" onClick={onClose}>Hủy</Button>
          <Button size="sm" type="submit" className="flex-1" isLoading={mutation.isPending}>
            {isEdit ? 'Cập nhật' : 'Thêm sản phẩm'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default function AdminProductsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | undefined>()
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: () => api.get<{ data: { items: Product[]; total: number } }>('/admin/products').then((r) => r.data.data.items),
  })

  const productCategories = useMemo(
    () => [...new Set(products.map((p) => p.category).filter(Boolean))],
    [products],
  )
  const lowStockCount = products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.isActive).length

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoryFilter || p.category === categoryFilter
    return matchSearch && matchCat
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] })
      setDeleteId(null)
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/admin/products/${id}`, { isActive }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })

  return (
    <div>
      <PageHeader
        title="Quản lý Sản phẩm"
        description={`${filtered.length} sản phẩm`}
        actions={
          <button
            onClick={() => { setEditProduct(undefined); setFormOpen(true) }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Thêm sản phẩm
          </button>
        }
      />

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-5">
          <AlertTriangle className="text-orange-400 shrink-0" size={16} />
          <p className="text-sm text-orange-700">
            <strong>{lowStockCount}</strong> sản phẩm có tồn kho thấp (≤ {LOW_STOCK_THRESHOLD} đơn vị).
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          <option value="">Tất cả danh mục</option>
          {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-40 bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <ActiveBadge isActive={product.isActive} />
              </div>
              {product.stock <= LOW_STOCK_THRESHOLD && product.isActive && (
                <div className="absolute top-3 left-3">
                  <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    <AlertTriangle size={10} />
                    Sắp hết
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-400 mb-1">{product.category}</p>
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-1 mb-3">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-primary-600">{formatPrice(product.price)}</span>
                <span className={`flex items-center gap-1 text-xs font-medium ${
                  product.stock <= LOW_STOCK_THRESHOLD ? 'text-orange-500' : 'text-gray-500'
                }`}>
                  <Package size={12} />
                  {product.stock} cái
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMutation.mutate({ id: product.id, isActive: !product.isActive })}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                  title={product.isActive ? 'Tắt sản phẩm' : 'Bật sản phẩm'}
                >
                  {product.isActive ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                </button>
                <button
                  onClick={() => { setEditProduct(product); setFormOpen(true) }}
                  className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Chỉnh sửa"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(product.id)}
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

      <ProductForm isOpen={formOpen} onClose={() => setFormOpen(false)} product={editProduct} categories={productCategories} />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Xóa sản phẩm"
        message="Sản phẩm sẽ bị xóa vĩnh viễn. Bạn có chắc chắn không?"
        confirmLabel="Xóa"
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
