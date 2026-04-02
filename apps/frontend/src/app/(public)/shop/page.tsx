import Link from 'next/link'

// Placeholder trang cửa hàng
export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-pink-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Cửa hàng</h1>
          <p className="text-white/90 text-lg">Sản phẩm chăm sóc sắc đẹp cao cấp</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-500 text-lg mb-6">
          Cửa hàng online đang được xây dựng. Hãy quay lại sau!
        </p>
        <Link href="/" className="btn-primary">
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}
