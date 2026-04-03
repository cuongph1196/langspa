import { BookingStatus, Booking } from './booking'
import { Service } from './service'
import { MembershipLevel, User } from './user'

// ─── Staff / Nhân viên ────────────────────────────────────────────────────────

export type StaffRole = 'TECHNICIAN' | 'RECEPTIONIST' | 'MANAGER'

export interface Staff {
  id: string
  fullName: string
  phone: string
  email: string
  role: StaffRole
  branchId: string
  branchName: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface CreateStaffDto {
  fullName: string
  phone: string
  email: string
  role: StaffRole
  branchId: string
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

export interface AdminCustomer extends User {
  totalBookings: number
  totalSpent: number
  lastBookingAt?: string
  notes?: string
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
