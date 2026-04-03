import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/register - Tạo tài khoản (yêu cầu đăng nhập)
  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Tạo tài khoản mới (yêu cầu xác thực)' })
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
