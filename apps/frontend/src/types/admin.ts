import { BookingStatus, Booking } from './booking'
import { Service } from './service'
import { MembershipLevel, User } from './user'

// ─── Staff / Nhân viên ────────────────────────────────────────────────────────

// Chức vụ nhân viên (vị trí công việc)
export type StaffPosition = 'TECHNICIAN' | 'RECEPTIONIST' | 'MANAGER' | 'CASHIER'

// Giữ lại alias để tránh breaking change ở các component đang dùng
export type StaffRole = StaffPosition

export interface Staff {
  id: string
  userId: string
  fullName: string
  phone?: string
  email?: string
  position?: StaffPosition
  branchId?: string
  branchName?: string
  isActive: boolean
  createdAt: string
}

export interface CreateStaffDto {
  email: string
  password: string
  phone?: string
  fullName: string
  position?: StaffPosition
  branchId?: string
}

// ─── Product / Sản phẩm ──────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
  isActive: boolean
  createdAt: string
}

export interface CreateProductDto {
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

// ─── Booking (Admin extended) ─────────────────────────────────────────────────

export interface AdminBooking extends Booking {
  customerName: string
  customerPhone: string
  customerEmail: string
  serviceName: string
  servicePrice: number
  branchName: string
  staffId?: string
  staffName?: string
}

export interface UpdateBookingStatusDto {
  status: BookingStatus
  staffId?: string
}

// ─── Customer (Admin extended) ───────────────────────────────────────────────

export interface AdminCustomer {
  id: string
  userId: string
  fullName: string
  phone: string
  email: string
  membershipLevel: MembershipLevel
  points: number
  totalBookings: number
  totalSpent: number
  lastBookingAt?: string
  notes?: string
  createdAt: string
}

export interface UpdateCustomerDto {
  points?: number
  membershipLevel?: MembershipLevel
  notes?: string
}

// ─── Dashboard / Reports ─────────────────────────────────────────────────────

export interface DashboardStats {
  todayBookings: number
  todayBookingsDelta: number
  monthRevenue: number
  monthRevenueDelta: number
  newCustomers: number
  newCustomersDelta: number
  pendingBookings: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  bookings: number
}

export interface ServiceStats {
  serviceId: string
  serviceName: string
  totalBookings: number
  totalRevenue: number
}

export interface BranchStats {
  branchId: string
  branchName: string
  totalBookings: number
  totalRevenue: number
  completionRate: number
}

export interface ReportSummary {
  totalRevenue: number
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  averageOrderValue: number
  completionRate: number
}
