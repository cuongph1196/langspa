// Loại tài khoản
export type UserType = 'STAFF' | 'CUSTOMER'

// Phân quyền (chỉ áp dụng cho STAFF)
export type UserRole = 'ADMIN' | 'MANAGER' | 'STAFF'

// Hạng thành viên (chỉ áp dụng cho CUSTOMER)
export type MembershipLevel = 'STANDARD' | 'SILVER' | 'GOLD' | 'VIP'

// Thông tin user từ JWT (decoded payload)
export interface AuthUser {
  userId: string
  email: string
  type: UserType
  role: UserRole | null
}

// Thông tin user đầy đủ (từ API /users/me)
export interface User {
  id: string
  email: string
  phone?: string
  avatar?: string
  type: UserType
  role: UserRole | null
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

// Thông tin customer profile (từ API /customers/me)
export interface CustomerProfile {
  id: string
  userId: string
  fullName: string
  phone: string
  email?: string
  membershipLevel: MembershipLevel
  points: number
  notes?: string
  createdAt: string
}

// Thông tin staff profile (từ API /staff/me)
export interface StaffProfile {
  id: string
  userId: string
  fullName: string
  position?: string
  branchId?: string
  createdAt: string
}
