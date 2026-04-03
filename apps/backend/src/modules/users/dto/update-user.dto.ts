import { IsString, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

// DTO cập nhật thông tin user
export class UpdateUserDto {
  @ApiProperty({ required: false, example: '0901234567' })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({ required: false, description: 'URL ảnh đại diện' })
  @IsString()
  @IsOptional()
  avatar?: string
}
