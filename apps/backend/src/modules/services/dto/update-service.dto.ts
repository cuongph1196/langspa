import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

// DTO cập nhật dịch vụ (tất cả fields optional)
export class UpdateServiceDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  price?: number

  @ApiProperty({ required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  duration?: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string
}
