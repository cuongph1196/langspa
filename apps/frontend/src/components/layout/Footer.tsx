import Link from 'next/link'
import { Flower2, MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo và tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Flower2 className="h-7 w-7 text-primary-400" />
              <span className="font-serif text-xl font-bold text-white">Láng Spa</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Chăm sóc sắc đẹp toàn diện – Nơi vẻ đẹp của bạn được nâng niu.
            </p>
            {/* Mạng xã hội */}
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              {/* TikTok icon */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.67a8.24 8.24 0 0 0 4.83 1.55V6.76a4.85 4.85 0 0 1-1.06-.07z" />
                </svg>
              </a>
              {/* Zalo icon */}
              <a
                href="https://zalo.me"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-full hover:bg-primary-600 transition-colors"
                aria-label="Zalo"
              >
                <span className="text-xs font-bold">Za</span>
              </a>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div>
            <h3 className="text-white font-semibold mb-4">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary-400 transition-colors">Giới thiệu</Link></li>
              <li><Link href="/services" className="hover:text-primary-400 transition-colors">Dịch vụ</Link></li>
              <li><Link href="/blog" className="hover:text-primary-400 transition-colors">Blog làm đẹp</Link></li>
              <li><Link href="/branches" className="hover:text-primary-400 transition-colors">Chi nhánh</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Dịch vụ */}
          <div>
            <h3 className="text-white font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-primary-400 transition-colors">Chăm sóc da mặt</Link></li>
              <li><Link href="/services" className="hover:text-primary-400 transition-colors">Massage thư giãn</Link></li>
              <li><Link href="/services" className="hover:text-primary-400 transition-colors">Triệt lông</Link></li>
              <li><Link href="/services" className="hover:text-primary-400 transition-colors">Trị liệu tóc</Link></li>
              <li><Link href="/shop" className="hover:text-primary-400 transition-colors">Mỹ phẩm</Link></li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-400 mt-0.5 flex-shrink-0" />
                <span>123 Đường Láng, Đống Đa, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <a href="tel:1900xxxx" className="hover:text-primary-400 transition-colors">
                  Hotline: 1900 xxxx
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@langspa.vn" className="hover:text-primary-400 transition-colors">
                  info@langspa.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          © 2024 Láng Spa. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  )
}
