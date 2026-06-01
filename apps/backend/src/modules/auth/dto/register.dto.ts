import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// DTO đăng ký tài khoản khách hàng
export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  fullName: string

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: '0901234567' })
  @IsString()
  phone: string

  @ApiProperty({ example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  avatar?: string
}
