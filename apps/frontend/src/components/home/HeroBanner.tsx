import Link from 'next/link'
import Image from 'next/image'

// Banner chính trang chủ
export default function HeroBanner() {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Ảnh nền */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1600&q=80"
          alt="Láng Beauty & Spa - Không gian thư giãn cao cấp"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay đen sang xám trung tính */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-800/70 to-ink-500/40" />
      </div>

      {/* Nội dung banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-white/30">
            ✨ Chào mừng đến Láng Beauty & Spa
          </span>

          {/* Tiêu đề chính */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Vẻ đẹp hoàn hảo
            <br />
            <span className="text-spa-rose">bắt đầu từ đây</span>
          </h1>

          {/* Mô tả */}
          <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
            Trải nghiệm dịch vụ chăm sóc sắc đẹp cao cấp với đội ngũ chuyên gia
            giàu kinh nghiệm. Để làn da và tinh thần của bạn được nâng niu đúng cách.
          </p>

          {/* Nút CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/booking"
              className="btn-primary text-center text-base"
            >
              📅 Đặt lịch ngay
            </Link>
            <Link
              href="/services"
              className="text-center font-semibold py-3 px-6 rounded-full border-2 border-white text-white hover:bg-white hover:text-primary-700 transition-all duration-300"
            >
              Xem dịch vụ
            </Link>
          </div>

          {/* Thống kê nhanh */}
          <div className="mt-12 flex gap-8">
            <div className="text-white">
              <div className="text-3xl font-bold">5000+</div>
              <div className="text-white/80 text-sm">Khách hàng hài lòng</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">10+</div>
              <div className="text-white/80 text-sm">Chi nhánh</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-white/80 text-sm">Dịch vụ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
