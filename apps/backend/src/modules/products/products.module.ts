import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsService } from './products.service'
import { ProductsController } from './products.controller'
import { ProductsAdminController } from './products-admin.controller'
import { Product } from './entities/product.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService],
  controllers: [ProductsController, ProductsAdminController],
  exports: [ProductsService],
})
export class ProductsModule {}
