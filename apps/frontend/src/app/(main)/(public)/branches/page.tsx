import { MapPin, Phone, Clock } from 'lucide-react'

// Danh sách chi nhánh
const branches = [
  {
    id: '1',
    name: 'Láng Beauty & Spa - Đống Đa',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    phone: '024 3xxx xxxx',
    openTime: '08:00',
    closeTime: '21:00',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: '2',
    name: 'Láng Beauty & Spa - Cầu Giấy',
    address: '456 Xuân Thủy, Cầu Giấy, Hà Nội',
    phone: '024 3xxx yyyy',
    openTime: '08:00',
    closeTime: '21:00',
    mapUrl: 'https://maps.google.com',
  },
  {
    id: '3',
    name: 'Láng Beauty & Spa - Hoàn Kiếm',
    address: '789 Hàng Bông, Hoàn Kiếm, Hà Nội',
    phone: '024 3xxx zzzz',
    openTime: '09:00',
    closeTime: '20:00',
    mapUrl: 'https://maps.google.com',
  },
]

// Trang danh sách chi nhánh
export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ink-800 to-ink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Chi nhánh</h1>
          <p className="text-white/90 text-lg">
            Tìm chi nhánh Láng Beauty & Spa gần nhất với bạn
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="card-spa p-6">
              {/* Tên chi nhánh */}
              <h2 className="font-serif text-xl font-bold text-gray-800 mb-4">
                {branch.name}
              </h2>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <a href={`tel:${branch.phone}`} className="hover:text-primary-600 transition-colors">
                    {branch.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary-500 flex-shrink-0" />
                  <span>
                    {branch.openTime} - {branch.closeTime} (Thứ 2 - CN)
                  </span>
                </div>
              </div>

              {/* Google Maps placeholder */}
              <div className="mt-4 h-40 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center text-gray-400">
                  <MapPin className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Google Maps</p>
                </div>
              </div>

              <a
                href={branch.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block w-full text-center py-2 px-4 border border-primary-200 text-primary-600 rounded-full text-sm hover:bg-primary-50 transition-colors"
              >
                Xem trên bản đồ
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
