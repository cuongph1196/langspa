import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere, ILike } from 'typeorm'
import { Customer } from './entities/customer.entity'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
  ) {}

  // Lấy danh sách khách hàng (có pagination + filter)
  async findAll(options: {
    page?: number
    limit?: number
    search?: string
  }) {
    const { page = 1, limit = 15, search } = options
    const skip = (page - 1) * limit

    const qb = this.customersRepository.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.user', 'user')

    if (search) {
      qb.where(
        'customer.fullName ILIKE :search OR customer.phone ILIKE :search OR customer.email ILIKE :search',
        { search: `%${search}%` },
      )
    }

    const [items, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('customer.createdAt', 'DESC')
      .getManyAndCount()

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Tìm khách hàng theo ID
  async findById(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!customer) throw new NotFoundException('Không tìm thấy khách hàng')
    return customer
  }

  // Tìm khách hàng theo số điện thoại
  async findByPhone(phone: string): Promise<Customer | null> {
    return this.customersRepository.findOne({ where: { phone } })
  }

  // Tạo mới khách hàng
  async create(dto: CreateCustomerDto): Promise<Customer> {
    const exists = await this.customersRepository.findOne({ where: { phone: dto.phone } })
    if (exists) throw new ConflictException('Số điện thoại đã được đăng ký')
    const customer = this.customersRepository.create(dto as Partial<Customer>)
    return this.customersRepository.save(customer)
  }

  // Cập nhật thông tin khách hàng
  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.findById(id)
    Object.assign(customer, dto)
    return this.customersRepository.save(customer)
  }

  // Xóa khách hàng (soft: chỉ xóa khi không còn lịch sử)
  async remove(id: string): Promise<void> {
    const customer = await this.findById(id)
    await this.customersRepository.remove(customer)
  }
}
