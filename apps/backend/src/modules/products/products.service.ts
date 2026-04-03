import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
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

  // Lấy tất cả sản phẩm cho admin (bao gồm cả inactive, có pagination)
  async findAllAdmin(query: { page?: number; limit?: number; search?: string; category?: string }) {
    const { page = 1, limit = 15, search, category } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (search) where.name = ILike(`%${search}%`)

    const [items, total] = await this.productsRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Tìm sản phẩm theo ID
  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } })
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm')
    return product
  }

  // Tạo sản phẩm mới
  async create(data: Partial<Product>): Promise<Product> {
    const product = this.productsRepository.create(data)
    return this.productsRepository.save(product)
  }

  // Cập nhật sản phẩm
  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = await this.findById(id)
    Object.assign(product, data)
    return this.productsRepository.save(product)
  }

  // Ẩn sản phẩm (soft delete)
  async remove(id: string): Promise<void> {
    const product = await this.findById(id)
    product.isActive = false
    await this.productsRepository.save(product)
  }
}
