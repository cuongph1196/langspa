import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

// DTO tạo dịch vụ mới
export class CreateServiceDto {
  @ApiProperty({ example: 'Chăm sóc da mặt' })
  @IsString()
  name: string

  @ApiProperty({ example: 'cham-soc-da-mat' })
  @IsString()
  slug: string

  @ApiProperty({ example: 'Mô tả dịch vụ...' })
  @IsString()
  description: string

  @ApiProperty({ example: 350000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number

  @ApiProperty({ example: 60 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  duration: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string
}
