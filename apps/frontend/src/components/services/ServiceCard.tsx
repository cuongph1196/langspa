import Link from 'next/link'
import Image from 'next/image'
import { Clock, Tag } from 'lucide-react'
import type { Service } from '@/types/service'
import { formatPrice } from '@/lib/utils'

interface ServiceCardProps {
  service: Service
}

// Card hiển thị thông tin một dịch vụ
export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="card-spa group">
      {/* Ảnh dịch vụ */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={service.imageUrl || 'https://via.placeholder.com/400x300'}
          alt={service.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Badge danh mục */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-medium px-2.5 py-1 rounded-full">
            {service.category.name}
          </span>
        </div>
      </div>

      {/* Nội dung card */}
      <div className="p-4">
        <h3 className="font-serif font-bold text-gray-800 text-lg mb-2 line-clamp-1">
          {service.name}
        </h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>

        {/* Thời gian và giá */}
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1 text-gray-500 text-sm">
            <Clock className="h-4 w-4" />
            {service.duration} phút
          </span>
          <span className="flex items-center gap-1 text-primary-600 font-semibold text-sm">
            <Tag className="h-4 w-4" />
            Từ {formatPrice(service.price)}
          </span>
        </div>

        {/* Nút đặt lịch */}
        <div className="flex gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="flex-1 text-center text-sm py-2 px-3 border border-primary-200 text-primary-600 rounded-full hover:bg-primary-50 transition-colors"
          >
            Xem thêm
          </Link>
          <Link
            href={`/booking?service=${service.id}`}
            className="flex-1 text-center btn-primary text-sm py-2 px-3"
          >
            Đặt lịch
          </Link>
        </div>
      </div>
    </div>
  )
}
