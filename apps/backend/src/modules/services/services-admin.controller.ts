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
import { ServicesService } from './services.service'
import { CreateServiceDto } from './dto/create-service.dto'
import { UpdateServiceDto } from './dto/update-service.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Admin - Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/services')
export class ServicesAdminController {
  constructor(private readonly servicesService: ServicesService) {}

  // GET /api/admin/services - Danh sách dịch vụ (bao gồm cả inactive)
  @Get()
  @ApiOperation({ summary: 'Danh sách dịch vụ (admin, bao gồm cả ẩn)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'category', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.servicesService.findAllAdmin({ page: +page, limit: +limit, search, category })
  }

  // GET /api/admin/services/:id - Chi tiết dịch vụ theo ID
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết dịch vụ theo ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findById(id)
  }

  // POST /api/admin/services - Tạo dịch vụ mới
  @Post()
  @ApiOperation({ summary: 'Tạo dịch vụ mới' })
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto)
  }

  // PATCH /api/admin/services/:id - Cập nhật dịch vụ
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật dịch vụ' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto)
  }

  // DELETE /api/admin/services/:id - Ẩn dịch vụ (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ẩn dịch vụ (soft delete, isActive = false)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id)
  }
}
