import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { Staff } from './entities/staff.entity'
import { CreateStaffDto } from './dto/create-staff.dto'
import { UpdateStaffDto } from './dto/update-staff.dto'

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
  ) {}

  // Lấy danh sách nhân viên (có pagination + filter theo chi nhánh)
  async findAll(options: {
    page?: number
    limit?: number
    branchId?: string
  }) {
    const { page = 1, limit = 15, branchId } = options
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<Staff> = {}
    if (branchId) where.branchId = branchId

    const [items, total] = await this.staffRepository.findAndCount({
      where,
      relations: ['user'],
      skip,
      take: limit,
      order: { updatedAt: 'DESC' },
    })

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Tìm nhân viên theo ID
  async findById(id: string): Promise<Staff> {
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    })
    if (!staff) throw new NotFoundException('Không tìm thấy nhân viên')
    return staff
  }

  // Tìm nhân viên theo userId
  async findByUserId(userId: string): Promise<Staff | null> {
    return this.staffRepository.findOne({
      where: { userId },
      relations: ['user'],
    })
  }

  // Tạo mới hồ sơ nhân viên
  async create(dto: CreateStaffDto): Promise<Staff> {
    const exists = await this.staffRepository.findOne({ where: { userId: dto.userId } })
    if (exists) throw new ConflictException('Tài khoản đã có hồ sơ nhân viên')
    const staff = this.staffRepository.create(dto as Partial<Staff>)
    return this.staffRepository.save(staff)
  }

  // Cập nhật thông tin nhân viên
  async update(id: string, dto: UpdateStaffDto): Promise<Staff> {
    const staff = await this.findById(id)
    Object.assign(staff, dto)
    return this.staffRepository.save(staff)
  }

  // Xóa hồ sơ nhân viên
  async remove(id: string): Promise<void> {
    const staff = await this.findById(id)
    await this.staffRepository.remove(staff)
  }
}
