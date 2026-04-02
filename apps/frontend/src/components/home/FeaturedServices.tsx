import Link from 'next/link'
import ServiceCard from '@/components/services/ServiceCard'

// Dữ liệu mẫu dịch vụ nổi bật
const featuredServices = [
  {
    id: '1',
    name: 'Chăm sóc da mặt',
    slug: 'cham-soc-da-mat',
    description: 'Làm sạch sâu, cấp ẩm và tái tạo da với công nghệ hiện đại, phù hợp mọi loại da.',
    price: 350000,
    duration: 60,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80',
    isActive: true,
    createdAt: '',
    category: { id: '1', name: 'Chăm sóc da', slug: 'cham-soc-da', icon: '✨' },
  },
  {
    id: '2',
    name: 'Massage thư giãn',
    slug: 'massage-thu-gian',
    description: 'Liệu pháp massage toàn thân giúp giảm căng thẳng, phục hồi năng lượng sau ngày dài.',
    price: 450000,
    duration: 90,
    imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80',
    isActive: true,
    createdAt: '',
    category: { id: '2', name: 'Massage', slug: 'massage', icon: '💆' },
  },
  {
    id: '3',
    name: 'Triệt lông công nghệ cao',
    slug: 'triet-long',
    description: 'Triệt lông vĩnh viễn bằng công nghệ Laser Diode hiện đại, an toàn và không đau.',
    price: 500000,
    duration: 45,
    imageUrl: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400&q=80',
    isActive: true,
    createdAt: '',
    category: { id: '3', name: 'Triệt lông', slug: 'triet-long', icon: '⚡' },
  },
  {
    id: '4',
    name: 'Trị liệu tóc',
    slug: 'tri-lieu-toc',
    description: 'Phục hồi và dưỡng tóc chuyên sâu với các liệu pháp keratin và protein cao cấp.',
    price: 280000,
    duration: 75,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80',
    isActive: true,
    createdAt: '',
    category: { id: '4', name: 'Tóc', slug: 'toc', icon: '💇' },
  },
]

// Section dịch vụ nổi bật trang chủ
export default function FeaturedServices() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề section */}
        <div className="text-center mb-12">
          <h2 className="section-title">Dịch vụ nổi bật</h2>
          <p className="section-subtitle">
            Khám phá những dịch vụ chăm sóc sắc đẹp được yêu thích nhất tại Láng Spa
          </p>
        </div>

        {/* Grid dịch vụ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-10">
          <Link href="/services" className="btn-primary">
            Xem tất cả dịch vụ
          </Link>
        </div>
      </div>
    </section>
  )
}
