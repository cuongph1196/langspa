import ServiceCard from '@/components/services/ServiceCard'
import type { Service } from '@/types/service'

interface ServiceListProps {
  services: Service[]
}

// Danh sách dịch vụ hiển thị theo grid
export default function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Không tìm thấy dịch vụ phù hợp.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
