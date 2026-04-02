import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

// Interface mở rộng Request để có user từ JWT
interface RequestWithUser extends Request {
  user: {
    userId: string
    email: string
  }
}

// Decorator lấy thông tin user hiện tại từ JWT token
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    return request.user
  },
)
