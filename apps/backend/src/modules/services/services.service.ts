import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike } from 'typeorm'
import { SpaService } from './entities/service.entity'

// Query params lọc dịch vụ
interface FindServicesQuery {
  category?: string
  search?: string
  page?: number
  limit?: number
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(SpaService)
    private readonly servicesRepository: Repository<SpaService>,
  ) {}

  // Lấy danh sách dịch vụ với filter
  async findAll(query: FindServicesQuery) {
    const { category, search, page = 1, limit = 12 } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { isActive: true }
    if (category) where.category = category
    if (search) where.name = ILike(`%${search}%`)

    const [items, total] = await this.servicesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  // Lấy tất cả dịch vụ cho admin (bao gồm cả inactive)
  async findAllAdmin(query: { page?: number; limit?: number; search?: string; category?: string }) {
    const { page = 1, limit = 15, search, category } = query
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (search) where.name = ILike(`%${search}%`)

    const [items, total] = await this.servicesRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Tìm dịch vụ theo ID
  async findById(id: string): Promise<SpaService> {
    const service = await this.servicesRepository.findOne({ where: { id } })
    if (!service) throw new NotFoundException('Không tìm thấy dịch vụ')
    return service
  }

  // Tìm dịch vụ theo slug
  async findBySlug(slug: string): Promise<SpaService> {
    const service = await this.servicesRepository.findOne({ where: { slug } })
    if (!service) throw new NotFoundException('Không tìm thấy dịch vụ')
    return service
  }

  // Tạo dịch vụ mới
  async create(data: Partial<SpaService>): Promise<SpaService> {
    const service = this.servicesRepository.create(data)
    return this.servicesRepository.save(service)
  }

  // Cập nhật dịch vụ
  async update(id: string, data: Partial<SpaService>): Promise<SpaService> {
    await this.servicesRepository.update(id, data)
    const service = await this.servicesRepository.findOne({ where: { id } })
    if (!service) throw new NotFoundException('Không tìm thấy dịch vụ')
    return service
  }

  // Xóa dịch vụ (soft delete)
  async remove(id: string): Promise<void> {
    await this.servicesRepository.update(id, { isActive: false })
  }
}
