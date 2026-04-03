import { IsString, IsOptional, IsEnum, IsUUID, IsDateString, IsNumber } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Gender } from '../../../common/enums/gender.enum'
import { StaffPosition } from '../entities/staff.entity'

export class CreateStaffDto {
  @ApiProperty({ description: 'ID tài khoản users liên kết' })
  @IsUUID()
  userId: string

  @ApiPropertyOptional({ description: 'ID chi nhánh' })
  @IsUUID()
  @IsOptional()
  branchId?: string

  @ApiProperty({ example: 'Trần Thị Mai' })
  @IsString()
  fullName: string

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

  @ApiPropertyOptional({ enum: StaffPosition })
  @IsEnum(StaffPosition)
  @IsOptional()
  position?: StaffPosition

  @ApiPropertyOptional({ example: 5000000 })
  @IsNumber()
  @IsOptional()
  salary?: number

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsDateString()
  @IsOptional()
  hiredDate?: string
}
