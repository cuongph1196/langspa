import BookingForm from '@/components/booking/BookingForm'
import { CheckCircle } from 'lucide-react'

// Các bước quy trình đặt lịch
const steps = [
  { step: '01', title: 'Chọn dịch vụ', desc: 'Chọn dịch vụ phù hợp với nhu cầu của bạn' },
  { step: '02', title: 'Chọn thời gian', desc: 'Chọn ngày, giờ và chi nhánh thuận tiện' },
  { step: '03', title: 'Nhập thông tin', desc: 'Điền thông tin cá nhân để xác nhận lịch hẹn' },
  { step: '04', title: 'Xác nhận', desc: 'Nhận xác nhận qua SMS/Email' },
]

// Trang đặt lịch
export default function BookingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-ink-800 to-ink-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-white mb-4">Đặt lịch hẹn</h1>
          <p className="text-white/90 text-lg">
            Đặt lịch dễ dàng, nhanh chóng - Chúng tôi sẽ liên hệ xác nhận trong 30 phút
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Hướng dẫn quy trình */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-gray-800 mb-6">
              Quy trình đặt lịch
            </h2>
            <div className="space-y-4">
              {steps.map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-600 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Cam kết */}
            <div className="mt-8 bg-ink-50 rounded-2xl p-5 border border-ink-100">
              <h3 className="font-semibold text-gray-800 mb-3">Cam kết của chúng tôi</h3>
              <ul className="space-y-2">
                {[
                  'Xác nhận lịch trong 30 phút',
                  'Nhắc lịch trước 24 giờ',
                  'Hủy lịch miễn phí trước 2 giờ',
                  'Đội ngũ chuyên gia được đào tạo bài bản',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form đặt lịch */}
          <div className="lg:col-span-3">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  )
}
