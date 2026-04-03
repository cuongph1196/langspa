'use client'

import { useAuth } from '@/hooks/useAuth'
import { UserRole, UserType } from '@/types/user'

interface PermissionGateProps {
  children: React.ReactNode
  requireType?: UserType
  requireRole?: UserRole
  fallback?: React.ReactNode
}

/**
 * Component bọc nội dung chỉ hiển thị khi user có đủ quyền
 * Dùng để ẩn/hiện UI elements theo role, không dùng để bảo vệ route
 *
 * Ví dụ:
 * <PermissionGate requireRole="MANAGER">
 *   <DeleteButton />
 * </PermissionGate>
 */
export default function PermissionGate({
  children,
  requireType,
  requireRole,
  fallback = null,
}: PermissionGateProps) {
  const { user, hasRole, isCustomer, isStaff } = useAuth()

  if (!user) return <>{fallback}</>

  // Kiểm tra type nếu có yêu cầu
  if (requireType) {
    if (requireType === 'CUSTOMER' && !isCustomer) return <>{fallback}</>
    if (requireType === 'STAFF' && !isStaff) return <>{fallback}</>
  }

  // Kiểm tra role nếu có yêu cầu
  if (requireRole && !hasRole(requireRole)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
