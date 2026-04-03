import { IsString, IsEmail, IsDateString, IsOptional, Matches, IsUUID } from 'class-validator'
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string

  // Khách hàng đã đăng ký
  @ApiProperty({ required: false, description: 'ID khách hàng đã đăng ký' })
  @IsUUID()
  @IsOptional()
  customerId?: string

  // Nhân viên thực hiện dịch vụ
  @ApiProperty({ required: false, description: 'ID nhân viên thực hiện' })
  @IsUUID()
  @IsOptional()
  staffId?: string

  // Thông tin khách vãng lai (nếu chưa có tài khoản)
  @ApiProperty({ required: false, example: 'Nguyễn Thị Hoa', description: 'Tên khách vãng lai' })
  @IsString()
  @IsOptional()
  guestName?: string

  @ApiProperty({ required: false, example: '0901234567', description: 'SĐT khách vãng lai' })
  @IsString()
  @IsOptional()
  @Matches(/^(0|\+84)[3-9][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  guestPhone?: string

  @ApiProperty({ required: false, example: 'email@example.com', description: 'Email khách vãng lai' })
  @IsEmail()
  @IsOptional()
  guestEmail?: string
}
