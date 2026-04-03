import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsEmail, Matches } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '../../../common/enums/gender.enum'
import { CustomerSource } from '../entities/customer.entity'

export class CreateCustomerDto {
  @ApiPropertyOptional({ description: 'ID tài khoản users liên kết (NULL nếu khách chưa đăng ký)' })
  @IsUUID()
  @IsOptional()
  userId?: string

  @ApiProperty({ example: 'Nguyễn Thị Hoa' })
  @IsString()
  fullName: string

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @Matches(/^(0|\+84)[3-9][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string

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

  @ApiPropertyOptional({ description: 'Ghi chú đặc biệt về khách hàng' })
  @IsString()
  @IsOptional()
  notes?: string

  @ApiPropertyOptional({ enum: CustomerSource })
  @IsEnum(CustomerSource)
  @IsOptional()
  source?: CustomerSource
}
