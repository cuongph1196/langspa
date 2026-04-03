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
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // GET /api/customers - Danh sách khách hàng
  @Get()
  @ApiOperation({ summary: 'Danh sách khách hàng' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm theo tên, SĐT, email' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('search') search?: string,
  ) {
    return this.customersService.findAll({ page: +page, limit: +limit, search })
  }

  // GET /api/customers/:id - Chi tiết khách hàng
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết khách hàng' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findById(id)
  }

  // POST /api/customers - Tạo khách hàng mới
  @Post()
  @ApiOperation({ summary: 'Tạo khách hàng mới' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customersService.create(dto)
  }

  // PATCH /api/customers/:id - Cập nhật thông tin khách hàng
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin khách hàng' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, dto)
  }

  // DELETE /api/customers/:id - Xóa khách hàng
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Xóa khách hàng' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id)
  }
}
