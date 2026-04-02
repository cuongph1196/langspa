import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// DTO cập nhật thông tin user
export class UpdateUserDto {
  @ApiProperty({ required: false, example: 'Nguyễn Thị Hoa' })
  @IsString()
  @IsOptional()
  fullName?: string

  @ApiProperty({ required: false, example: '0901234567' })
  @IsString()
  @IsOptional()
  phone?: string
}
