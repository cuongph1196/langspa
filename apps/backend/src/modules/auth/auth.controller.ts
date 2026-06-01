import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register - Đăng ký tài khoản khách hàng (public)
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản khách hàng' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  // POST /api/auth/login - Đăng nhập
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đăng nhập' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }
}
