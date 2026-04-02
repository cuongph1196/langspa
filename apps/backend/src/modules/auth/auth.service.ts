import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Đăng ký tài khoản mới
  async register(registerDto: RegisterDto) {
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.usersService.findByEmail(registerDto.email)
    if (existingUser) {
      throw new ConflictException('Email đã được đăng ký')
    }

    // Hash mật khẩu trước khi lưu
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    })

    const token = this.generateToken(user.id, user.email)
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, access_token: token }
  }

  // Đăng nhập và trả về JWT token
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    }

    const token = this.generateToken(user.id, user.email)
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, access_token: token }
  }

  // Xác thực user (dùng cho Passport)
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) return null

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) return null

    return user
  }

  // Tạo JWT token
  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email })
  }
}
