import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthUser, UserRole, UserType } from '@/types/user'

interface AuthState {
  user: AuthUser | null
  token: string | null

  // Actions
  setAuth: (user: AuthUser, token: string) => void
  clearAuth: () => void

  // Getters / Permission helpers
  isAuthenticated: () => boolean
  isCustomer: () => boolean
  isStaff: () => boolean      // type === STAFF (bất kỳ role nào)
  isManager: () => boolean    // role === MANAGER hoặc ADMIN
  isAdmin: () => boolean      // role === ADMIN
  hasRole: (role: UserRole) => boolean
  canAccess: (path: string) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({ user, token })
        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', token)
        }
      },

      clearAuth: () => {
        set({ user: null, token: null })
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token')
        }
      },

      isAuthenticated: () => !!get().token,

      isCustomer: () => get().user?.type === 'CUSTOMER',

      isStaff: () => get().user?.type === 'STAFF',

      isManager: () => {
        const role = get().user?.role
        return role === 'MANAGER' || role === 'ADMIN'
      },

      isAdmin: () => get().user?.role === 'ADMIN',

      hasRole: (role: UserRole) => {
        const userRole = get().user?.role
        if (!userRole) return false
        // Hierarchy: ADMIN > MANAGER > STAFF
        if (role === 'STAFF') return ['STAFF', 'MANAGER', 'ADMIN'].includes(userRole)
        if (role === 'MANAGER') return ['MANAGER', 'ADMIN'].includes(userRole)
        if (role === 'ADMIN') return userRole === 'ADMIN'
        return false
      },

      canAccess: (path: string) => {
        const user = get().user
        if (!user) return false

        // CUSTOMER chỉ được /profile và /booking
        if (user.type === 'CUSTOMER') {
          return (
            path.startsWith('/profile') ||
            path.startsWith('/booking') ||
            path === '/' ||
            path.startsWith('/(main)')
          )
        }

        // STAFF type - kiểm tra theo role
        if (user.type === 'STAFF') {
          if (user.role === 'ADMIN') return true  // ADMIN toàn quyền

          if (user.role === 'MANAGER') {
            // MANAGER: bookings, staff, reports + services, products, customers
            const allowed = [
              '/admin/bookings',
              '/admin/staff',
              '/admin/reports',
              '/admin/services',
              '/admin/products',
              '/admin/customers',
            ]
            return allowed.some((p) => path.startsWith(p)) || path === '/admin'
          }

          if (user.role === 'STAFF') {
            // STAFF: chỉ xem lịch và cập nhật booking
            return path.startsWith('/admin/bookings') || path === '/admin'
          }
        }

        return false
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
