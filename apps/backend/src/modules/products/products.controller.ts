import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { ProductsService } from './products.service'
import { CreateProductDto } from './dto/create-product.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // GET /api/products - Danh sách sản phẩm
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  async findAll() {
    return this.productsService.findAll()
  }

  // POST /api/products - Tạo sản phẩm mới (cần auth)
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto)
  }
}
