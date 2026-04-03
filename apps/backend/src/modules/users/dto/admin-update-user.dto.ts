import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole } from '../entities/user.entity'

export class AdminUpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyễn Thị Hoa' })
  @IsOptional()
  @IsString()
  fullName?: string

  @ApiPropertyOptional({ example: 'email@langspa.com' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.TECHNICIAN })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiPropertyOptional({ example: 'uuid-branch-id' })
  @IsOptional()
  @IsString()
  branchId?: string

  @ApiPropertyOptional({ type: [String], example: ['Chăm sóc da', 'Massage'] })
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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class UpdatePointsDto {
  @ApiPropertyOptional({
    example: 100,
    description: 'Số điểm cộng (dương) hoặc trừ (âm)',
  })
  delta: number
}
