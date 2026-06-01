import { Star } from 'lucide-react'

// Dữ liệu đánh giá khách hàng mẫu
const testimonials = [
  {
    id: '1',
    name: 'Nguyễn Thị Hương',
    avatar: 'H',
    rating: 5,
    content:
      'Tôi rất hài lòng với dịch vụ tại Láng Beauty & Spa. Nhân viên rất chuyên nghiệp và tận tình. Da mặt tôi cải thiện rõ rệt sau 3 buổi chăm sóc. Nhất định sẽ quay lại!',
    service: 'Chăm sóc da mặt',
  },
  {
    id: '2',
    name: 'Trần Minh Châu',
    avatar: 'C',
    rating: 5,
    content:
      'Không gian spa rất sang trọng và thư giãn. Dịch vụ massage toàn thân tuyệt vời, giúp tôi xả stress sau những ngày làm việc căng thẳng. Rất đáng tiền!',
    service: 'Massage thư giãn',
  },
  {
    id: '3',
    name: 'Lê Thu Trang',
    avatar: 'T',
    rating: 5,
    content:
      'Đội ngũ kỹ thuật viên tại Láng Beauty & Spa rất giỏi và nhiệt tình. Tôi đã triệt lông 5 buổi và kết quả rất tốt. Công nghệ laser không đau và an toàn.',
    service: 'Triệt lông',
  },
]

// Hiển thị sao đánh giá
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )
}

// Section đánh giá khách hàng
export default function Testimonials() {
  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="section-title">Khách hàng nói gì về chúng tôi</h2>
          <p className="section-subtitle">
            Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ tại Láng Beauty & Spa
          </p>
        </div>

        {/* Grid đánh giá */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div key={item.id} className="card-spa p-6">
              {/* Avatar và tên */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{item.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.service}</p>
                </div>
              </div>

              {/* Sao đánh giá */}
              <StarRating rating={item.rating} />

              {/* Nội dung đánh giá */}
              <p className="text-gray-600 text-sm leading-relaxed mt-3 italic">
                &ldquo;{item.content}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
