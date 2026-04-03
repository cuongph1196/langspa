import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { StaffService } from './staff.service'
import { CreateStaffDto } from './dto/create-staff.dto'
import { UpdateStaffDto } from './dto/update-staff.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Staff')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  // GET /api/staff - Danh sách nhân viên
  @Get()
  @ApiOperation({ summary: 'Danh sách nhân viên' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'branchId', required: false, description: 'Lọc theo chi nhánh' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('branchId') branchId?: string,
  ) {
    return this.staffService.findAll({ page: +page, limit: +limit, branchId })
  }

  // GET /api/staff/:id - Chi tiết nhân viên
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết nhân viên' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffService.findById(id)
  }

  // POST /api/staff - Tạo hồ sơ nhân viên mới
  @Post()
  @ApiOperation({ summary: 'Tạo hồ sơ nhân viên mới' })
  create(@Body() dto: CreateStaffDto) {
    return this.staffService.create(dto)
  }

  // PATCH /api/staff/:id - Cập nhật thông tin nhân viên
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin nhân viên' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.update(id, dto)
  }

  // DELETE /api/staff/:id - Xóa hồ sơ nhân viên
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa hồ sơ nhân viên' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffService.remove(id)
  }
}
