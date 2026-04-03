import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { UserRole, UserType } from '../../modules/users/entities/user.entity'
import { ROLES_KEY, TYPES_KEY } from '../decorators/roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const requiredTypes = this.reflector.getAllAndOverride<UserType[]>(TYPES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const { user } = context.switchToHttp().getRequest()

    // Kiểm tra type nếu có yêu cầu
    if (requiredTypes && requiredTypes.length > 0 && !requiredTypes.includes(user.type)) {
      throw new ForbiddenException('Bạn không có quyền truy cập tính năng này')
    }

    // Kiểm tra role nếu có yêu cầu
    if (requiredRoles && requiredRoles.length > 0) {
      if (!user.role || !requiredRoles.includes(user.role)) {
        throw new ForbiddenException('Bạn không có quyền thực hiện hành động này')
      }
    }

    return true
  }
}
