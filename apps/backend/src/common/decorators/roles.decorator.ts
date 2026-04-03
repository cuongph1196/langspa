import { SetMetadata } from '@nestjs/common'
import { UserRole, UserType } from '../../modules/users/entities/user.entity'

// Key metadata cho roles
export const ROLES_KEY = 'roles'

// Decorator khai báo roles được phép truy cập endpoint
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)

// Key metadata cho types
export const TYPES_KEY = 'types'

// Decorator khai báo loại tài khoản được phép truy cập endpoint
export const RequireType = (...types: UserType[]) => SetMetadata(TYPES_KEY, types)
