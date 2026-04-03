import { IsString, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'

// DTO cập nhật sản phẩm (tất cả fields optional)
export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'Kem dưỡng ẩm Clinique' })
  @IsOptional()
  @IsString()
  name?: string

  @ApiPropertyOptional({ example: 'kem-duong-am-clinique' })
  @IsOptional()
  @IsString()
  slug?: string

  @ApiPropertyOptional({ example: 'Mô tả sản phẩm...' })
  @IsOptional()
  @IsString()
  description?: string

  @ApiPropertyOptional({ example: 450000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
