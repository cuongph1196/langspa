'use client'

import { useAuthStore } from '@/store/auth.store'
import { getRoleDisplayName } from '@/lib/auth'

/**
 * Hook tiện ích để sử dụng auth state trong components
 */
export function useAuth() {
  const store = useAuthStore()

  return {
    user: store.user,
    token: store.token,
    isAuthenticated: store.isAuthenticated(),
    isCustomer: store.isCustomer(),
    isStaff: store.isStaff(),
    isManager: store.isManager(),
    isAdmin: store.isAdmin(),
    hasRole: store.hasRole,
    canAccess: store.canAccess,
    setAuth: store.setAuth,
    clearAuth: store.clearAuth,
    // Tên hiển thị của role
    roleDisplayName: store.user
      ? getRoleDisplayName(store.user.role, store.user.type)
      : '',
  }
}
