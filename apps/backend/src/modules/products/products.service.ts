import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  // Lấy tất cả sản phẩm đang active
  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    })
  }

  // Tạo sản phẩm mới
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(data)
    return this.productsRepository.save(product)
  }
}
