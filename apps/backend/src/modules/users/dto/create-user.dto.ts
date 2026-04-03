import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole, UserType } from '../entities/user.entity'

export class CreateUserDto {
  @ApiProperty({ example: 'mai.tran@langspa.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'Password@123', description: 'Mật khẩu tối thiểu 6 ký tự' })
  @IsString()
  @MinLength(6)
  password: string

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ enum: UserType, example: UserType.STAFF, description: 'Loại tài khoản' })
  @IsEnum(UserType)
  type: UserType

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.STAFF, description: 'Vai trò phân quyền (chỉ dành cho STAFF)' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string
}
