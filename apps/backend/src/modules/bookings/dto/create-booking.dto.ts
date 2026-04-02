import { IsString, IsEmail, IsDateString, IsOptional, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// DTO tạo lịch hẹn mới
export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-service-id' })
  @IsString()
  serviceId: string

  @ApiProperty({ example: 'uuid-branch-id' })
  @IsString()
  branchId: string

  @ApiProperty({ example: '2025-01-15' })
  @IsDateString()
  bookingDate: string

  @ApiProperty({ example: '10:00' })
  @IsString()
  timeSlot: string

  @ApiProperty({ example: 'Nguyễn Thị Hoa' })
  @IsString()
  fullName: string

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @Matches(/^(0|\+84)[3-9][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string

  @ApiProperty({ example: 'email@example.com' })
  @IsEmail()
  email: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string
}
