import { IsString, IsNumber, IsOptional, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

// DTO tạo sản phẩm mới
export class CreateProductDto {
  @ApiProperty({ example: 'Kem dưỡng ẩm Clinique' })
  @IsString()
  name: string

  @ApiProperty({ example: 'kem-duong-am-clinique' })
  @IsString()
  slug: string

  @ApiProperty({ example: 'Mô tả sản phẩm...' })
  @IsString()
  description: string

  @ApiProperty({ example: 450000 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number

  @ApiProperty({ required: false, example: 100 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stock?: number

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category?: string
}
