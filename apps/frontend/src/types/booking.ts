// Trạng thái đặt lịch
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

// Khung giờ có sẵn
export interface TimeSlot {
  time: string
  available: boolean
}

// Thông tin đặt lịch
export interface Booking {
  id: string
  serviceId: string
  branchId: string
  bookingDate: string
  timeSlot: string
  status: BookingStatus
  notes?: string
  createdAt: string
}

// Dữ liệu tạo đặt lịch mới
export interface CreateBookingDto {
  serviceId: string
  branchId: string
  bookingDate: string
  timeSlot: string
  fullName: string
  phone: string
  email: string
  notes?: string
}
