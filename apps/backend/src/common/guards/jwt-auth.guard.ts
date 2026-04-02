import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// Guard xác thực JWT token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
