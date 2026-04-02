// Hạng thành viên
export type MembershipLevel = 'STANDARD' | 'SILVER' | 'GOLD' | 'VIP'

// Thông tin người dùng
export interface User {
  id: string
  email: string
  fullName: string
  phone: string
  membershipLevel: MembershipLevel
  points: number
  createdAt: string
}
