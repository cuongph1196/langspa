import { IsString, IsEmail, IsOptional, IsBoolean, IsEnum } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { UserRole, UserType } from '../entities/user.entity'

export class AdminUpdateUserDto {
  @ApiPropertyOptional({ example: 'email@langspa.com' })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiPropertyOptional({ example: '0901234567' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiPropertyOptional({ enum: UserType, example: UserType.STAFF })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType

  @ApiPropertyOptional({ enum: UserRole, example: UserRole.STAFF })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string

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
