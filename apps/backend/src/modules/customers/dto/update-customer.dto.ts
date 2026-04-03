import { IsString, IsOptional, IsEnum, IsDateString, IsEmail, IsNumber, Matches } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '../../../common/enums/gender.enum'
import { CustomerSource, MembershipLevel } from '../entities/customer.entity'

export class UpdateCustomerDto {
  @ApiPropertyOptional({ example: 'Nguyễn Thị Hoa' })
  @IsString()
  @IsOptional()
  fullName?: string

  @ApiPropertyOptional({ example: '0901234567' })
  @IsString()
  @IsOptional()
  @Matches(/^(0|\+84)[3-9][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phone?: string

  @ApiPropertyOptional({ example: 'hoa@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({ enum: Gender })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender

  @ApiPropertyOptional({ example: '1990-01-15' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string

  @ApiPropertyOptional({ example: '123 Nguyễn Văn Cừ, Q5, TP.HCM' })
  @IsString()
  @IsOptional()
  address?: string

  @ApiPropertyOptional({ enum: MembershipLevel })
  @IsEnum(MembershipLevel)
  @IsOptional()
  membershipLevel?: MembershipLevel

  @ApiPropertyOptional({ example: 100, description: 'Cập nhật điểm tích lũy' })
  @IsNumber()
  @IsOptional()
  points?: number

  @ApiPropertyOptional({ description: 'Ghi chú đặc biệt về khách hàng' })
  @IsString()
  @IsOptional()
  notes?: string

  @ApiPropertyOptional({ enum: CustomerSource })
  @IsEnum(CustomerSource)
  @IsOptional()
  source?: CustomerSource
}
