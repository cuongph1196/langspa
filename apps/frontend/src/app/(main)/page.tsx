import HeroBanner from '@/components/home/HeroBanner'
import FeaturedServices from '@/components/home/FeaturedServices'
import Promotions from '@/components/home/Promotions'
import Testimonials from '@/components/home/Testimonials'

// Trang chủ Láng Beauty & Spa
export default function HomePage() {
  return (
    <>
      {/* Banner chính */}
      <HeroBanner />

      {/* Dịch vụ nổi bật */}
      <FeaturedServices />

      {/* Ưu đãi đặc biệt */}
      <Promotions />

      {/* Đánh giá khách hàng */}
      <Testimonials />
    </>
  )
}
