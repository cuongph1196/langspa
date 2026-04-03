// Danh mục dịch vụ spa (legacy - kept for reference)
export interface ServiceCategory {
  id: string
  name: string
  slug: string
  icon: string
}

// Dịch vụ spa
export interface Service {
  id: string
  name: string
  slug: string
  description: string
  price: number
  duration: number // phút
  category: string
  imageUrl: string
  isActive: boolean
  createdAt: string
}
