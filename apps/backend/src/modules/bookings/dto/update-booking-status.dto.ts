import { IsEnum } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    example: 'CONFIRMED',
  })
  @IsEnum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'], {
    message: 'status phải là PENDING, CONFIRMED, COMPLETED hoặc CANCELLED',
  })
  status: string
}
