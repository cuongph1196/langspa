'use client'

import { useState } from 'react'
import ServiceList from '@/components/services/ServiceList'
import type { Service } from '@/types/service'

// Danh mục dịch vụ
const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'cham-soc-da', name: 'Chăm sóc da' },
  { id: 'massage', name: 'Massage' },
  { id: 'triet-long', name: 'Triệt lông' },
  { id: 'toc', name: 'Tóc' },
]

// Dữ liệu mẫu dịch vụ
const allServices: Service[] = [
  {
    id: '1',
    name: 'Chăm sóc da mặt cơ bản',
    slug: 'cham-soc-da-mat-co-ban',
    description: 'Làm sạch sâu, cấp ẩm và tái tạo da với công nghệ hiện đại.',
    price: 350000,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Chăm sóc da',
  },
  {
    id: '2',
    name: 'Massage thư giãn toàn thân',
    slug: 'massage-thu-gian',
    description: 'Liệu pháp massage toàn thân giúp giảm căng thẳng.',
    price: 450000,
    duration: 90,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Massage',
  },
  {
    id: '3',
    name: 'Triệt lông vùng bikini',
    slug: 'triet-long-bikini',
    description: 'Triệt lông vĩnh viễn an toàn với công nghệ Laser Diode.',
    price: 500000,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Triệt lông',
  },
  {
    id: '4',
    name: 'Phục hồi tóc Keratin',
    slug: 'phuc-hoi-toc-keratin',
    description: 'Phục hồi và dưỡng tóc chuyên sâu với liệu pháp Keratin.',
    price: 280000,
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Tóc',
  },
  {
    id: '5',
    name: 'Trẻ hóa da bằng RF',
    slug: 'tre-hoa-da-rf',
    description: 'Công nghệ RF giúp kích thích tái tạo collagen, làm căng da.',
    price: 800000,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Chăm sóc da',
  },
  {
    id: '6',
    name: 'Massage đá nóng',
    slug: 'massage-da-nong',
    description: 'Liệu pháp massage với đá bazan nóng giúp thư giãn sâu.',
    price: 650000,
    duration: 90,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Massage',
  },
]

// Trang danh sách dịch vụ
export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  // Lọc dịch vụ theo danh mục và từ khóa tìm kiếm
  const filteredServices = allServices.filter((s) => {
    const matchCategory = activeCategory === 'all' || s.category === activeCategory
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header trang */}
      <div className="bg-gradient-to-r from-primary-600 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">
            Dịch vụ của chúng tôi
          </h1>
          <p className="text-white/90 text-lg">
            Khám phá đa dạng dịch vụ chăm sóc sắc đẹp cao cấp tại Láng Spa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tìm kiếm */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Bộ lọc danh mục */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Danh sách dịch vụ */}
        <ServiceList services={filteredServices} />
      </div>
    </div>
  )
}
