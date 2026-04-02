import { formatPrice } from '@/lib/utils'

// Section ưu đãi đặc biệt
const promotions = [
  {
    id: '1',
    name: 'Combo Chăm sóc da toàn diện',
    originalPrice: 1200000,
    salePrice: 799000,
    discount: 33,
    description: 'Gồm: Làm sạch da + Tẩy tế bào chết + Đắp mặt nạ dưỡng ẩm',
    tag: 'HOT',
  },
  {
    id: '2',
    name: 'Gói Massage thư giãn 3 buổi',
    originalPrice: 1350000,
    salePrice: 899000,
    discount: 33,
    description: 'Massage toàn thân 90 phút x 3 buổi, tặng thêm xông hơi miễn phí',
    tag: 'HOT',
  },
  {
    id: '3',
    name: 'Combo Triệt lông toàn thân',
    originalPrice: 5000000,
    salePrice: 2990000,
    discount: 40,
    description: 'Triệt lông vĩnh viễn toàn thân bằng công nghệ Laser Diode',
    tag: 'SALE',
  },
]

// Hàm formatPrice được import từ @/lib/utils
export default function Promotions() {
  return (
    <section className="py-20 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề section */}
        <div className="text-center mb-12">
          <h2 className="section-title">Ưu đãi đặc biệt</h2>
          <p className="section-subtitle">
            Tiết kiệm hơn với các combo và gói dịch vụ đặc biệt tại Láng Spa
          </p>
        </div>

        {/* Grid ưu đãi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="card-spa relative">
              {/* Badge ưu đãi */}
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {promo.tag}
                </span>
              </div>

              {/* Badge % giảm */}
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-secondary-500 text-white text-sm font-bold w-12 h-12 rounded-full flex items-center justify-center">
                  -{promo.discount}%
                </span>
              </div>

              {/* Banner màu gradient */}
              <div className="h-24 bg-gradient-to-r from-secondary-400 to-spa-gold" />

              <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-gray-800 mb-2">
                  {promo.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{promo.description}</p>

                {/* Giá */}
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatPrice(promo.salePrice)}
                  </span>
                  <span className="text-gray-400 line-through text-sm mb-1">
                    {formatPrice(promo.originalPrice)}
                  </span>
                </div>

                <button className="w-full btn-primary text-sm">
                  Đặt lịch ngay
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
