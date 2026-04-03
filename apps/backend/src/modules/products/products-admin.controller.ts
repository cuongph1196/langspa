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
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Admin - Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/products')
export class ProductsAdminController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/admin/products - Danh sách sản phẩm (bao gồm cả inactive)
  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm (admin, bao gồm cả ẩn)' })
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
    return this.productsService.findAllAdmin({ page: +page, limit: +limit, search, category })
  }

  // GET /api/admin/products/:id - Chi tiết sản phẩm
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết sản phẩm theo ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findById(id)
  }

  // POST /api/admin/products - Tạo sản phẩm mới
  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto)
  }

  // PATCH /api/admin/products/:id - Cập nhật sản phẩm
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto)
  }

  // DELETE /api/admin/products/:id - Ẩn sản phẩm (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Ẩn sản phẩm (soft delete, isActive = false)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id)
  }
}
