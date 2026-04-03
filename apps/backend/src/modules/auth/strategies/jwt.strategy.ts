import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UserRole, UserType } from '../../users/entities/user.entity'

// JWT Payload interface — chứa type và role để RolesGuard hoạt động
interface JwtPayload {
  sub: string
  email: string
  type: UserType
  role: UserRole | null
}

// Passport JWT Strategy để xác thực token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', 'default-secret'),
    })
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      type: payload.type,
      role: payload.role,
    }
  }
}
