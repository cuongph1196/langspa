import { AuthUser } from '@/types/user'

/**
 * Decode JWT token để lấy payload (không verify signature)
 * Chỉ dùng ở client-side để đọc thông tin user
 */
export function decodeJwt(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    const payload = JSON.parse(jsonPayload)

    return {
      userId: payload.sub,
      email: payload.email,
      type: payload.type,
      role: payload.role ?? null,
    }
  } catch {
    return null
  }
}

/**
 * Lấy redirect URL sau khi đăng nhập dựa trên type và role
 */
export function getRedirectAfterLogin(user: AuthUser): string {
  if (user.type === 'CUSTOMER') {
    return '/profile'
  }
  // STAFF type → vào admin panel
  return '/admin'
}

/**
 * Lấy tên hiển thị cho role/type
 */
export function getRoleDisplayName(role: string | null, type: string): string {
  if (type === 'CUSTOMER') return 'Khách hàng'
  switch (role) {
    case 'ADMIN': return 'Quản trị viên'
    case 'MANAGER': return 'Quản lý'
    case 'STAFF': return 'Nhân viên'
    default: return 'Nhân viên'
  }
}
