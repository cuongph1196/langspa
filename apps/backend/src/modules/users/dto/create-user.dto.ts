import { IsString, IsEmail, IsOptional, IsEnum, IsArray, MinLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '../entities/user.entity'

export class CreateUserDto {
  @ApiProperty({ example: 'Trần Thị Mai' })
  @IsString()
  fullName: string

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

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.CUSTOMER, default: UserRole.CUSTOMER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiPropertyOptional({ example: 'uuid-branch-id' })
  @IsOptional()
  @IsString()
  branchId?: string

  @ApiPropertyOptional({
    type: [String],
    example: ['Chăm sóc da', 'Massage'],
    description: 'Danh sách dịch vụ có thể thực hiện (dành cho kỹ thuật viên)',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarUrl?: string

  @ApiPropertyOptional({ example: 'Kỹ thuật viên cấp cao' })
  @IsOptional()
  @IsString()
  position?: string
}
