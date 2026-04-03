import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '../../users/entities/user.entity'

// DTO đăng ký tài khoản mới
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiProperty({ example: '0901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ enum: UserType, example: UserType.CUSTOMER, description: 'Loại tài khoản' })
  @IsEnum(UserType)
  type: UserType
}
