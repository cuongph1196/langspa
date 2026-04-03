import Image from 'next/image'
import Link from 'next/link'
import BookingForm from '@/components/booking/BookingForm'
import { Clock, Tag, ArrowLeft } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { Service } from '@/types/service'

// Dữ liệu mẫu chi tiết dịch vụ
const serviceData: Record<string, Service & { fullDescription: string }> = {
  'cham-soc-da-mat': {
    id: '1',
    name: 'Chăm sóc da mặt',
    slug: 'cham-soc-da-mat',
    description: 'Làm sạch sâu, cấp ẩm và tái tạo da với công nghệ hiện đại.',
    fullDescription: `
      Liệu trình chăm sóc da mặt toàn diện tại Láng Spa giúp làn da của bạn 
      trở nên mịn màng, căng bóng và rạng rỡ hơn. Với công nghệ hiện đại kết hợp 
      các sản phẩm cao cấp, chúng tôi cam kết mang đến làn da khỏe mạnh cho bạn.
      
      Quy trình bao gồm: làm sạch da 2 lớp, tẩy tế bào chết bằng enzyme, 
      đắp mặt nạ dưỡng ẩm chuyên sâu và massage mặt thư giãn.
    `,
    price: 350000,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Chăm sóc da',
  },
}

// Dịch vụ liên quan
const relatedServices: Service[] = [
  {
    id: '5',
    name: 'Trẻ hóa da bằng RF',
    slug: 'tre-hoa-da-rf',
    description: 'Công nghệ RF kích thích tái tạo collagen.',
    price: 800000,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
    isActive: true,
    createdAt: '2024-01-01',
    category: 'Chăm sóc da',
  },
]

interface ServiceDetailPageProps {
  params: { slug: string }
}

// Trang chi tiết dịch vụ
export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  // Lấy dữ liệu dịch vụ theo slug (trong thực tế sẽ fetch từ API)
  const service = serviceData[params.slug] || serviceData['cham-soc-da-mat']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại danh sách dịch vụ
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nội dung chính */}
          <div className="lg:col-span-2">
            {/* Ảnh lớn */}
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden mb-6">
              <Image
                src={service.imageUrl}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thông tin dịch vụ */}
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">
                  {service.category}
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-gray-800 mb-4">
                {service.name}
              </h1>

              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="h-5 w-5 text-primary-500" />
                  <span>{service.duration} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary-500" />
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>

              <div className="prose prose-gray max-w-none">
                <h2 className="font-serif text-xl font-bold mb-3">Mô tả dịch vụ</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {service.fullDescription}
                </p>
              </div>
            </div>

            {/* Dịch vụ liên quan */}
            {relatedServices.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
                  Dịch vụ liên quan
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedServices.map((s) => (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-pink-50 transition-colors"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={s.imageUrl} alt={s.name} fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">{s.name}</p>
                        <p className="text-primary-600 text-sm font-semibold mt-1">
                          {formatPrice(s.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar đặt lịch */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
                Đặt lịch ngay
              </h2>
              <BookingForm serviceId={service.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
