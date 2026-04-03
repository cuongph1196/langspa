import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, FindOptionsWhere } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User, UserRole } from './entities/user.entity'

// DTO cập nhật profile
interface UpdateUserDto {
  fullName?: string
  phone?: string
}

const USER_SAFE_SELECT: (keyof User)[] = [
  'id', 'email', 'fullName', 'phone', 'role',
  'branchId', 'specialties', 'avatarUrl', 'position',
  'isActive', 'createdAt', 'updatedAt',
]

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Tìm user theo email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  // Tìm user theo ID
  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundException('Không tìm thấy người dùng')
    return user
  }

  // Tạo user mới (internal, dùng cho auth.service)
  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data)
    return this.usersRepository.save(user)
  }

  // Cập nhật thông tin user (public profile)
  async update(id: string, data: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, data)
    return this.findById(id)
  }

  // Lấy danh sách user (admin, có pagination + filter)
  async findAllAdmin(options: {
    page?: number
    limit?: number
    search?: string
    role?: UserRole
    branchId?: string
  }) {
    const { page = 1, limit = 15, search, role, branchId } = options
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<User> = {}
    if (search) where.fullName = ILike(`%${search}%`)
    if (role) where.role = role
    if (branchId) where.branchId = branchId

    const [items, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      select: USER_SAFE_SELECT,
    })

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Tạo user mới từ admin (hash password)
  async createAdmin(data: {
    fullName: string
    email: string
    password: string
    phone?: string
    role?: UserRole
    branchId?: string
    specialties?: string[]
    avatarUrl?: string
    position?: string
  }): Promise<Omit<User, 'password'>> {
    const exists = await this.usersRepository.findOne({ where: { email: data.email } })
    if (exists) throw new ConflictException('Email đã tồn tại')
    const hashed = await bcrypt.hash(data.password, 10)
    const user = this.usersRepository.create({ ...data, password: hashed })
    const saved = await this.usersRepository.save(user)
    const { password: _, ...withoutPassword } = saved
    return withoutPassword
  }

  // Cập nhật thông tin user (admin)
  async adminUpdate(
    id: string,
    data: Partial<Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id)
    Object.assign(user, data)
    const saved = await this.usersRepository.save(user)
    const { password: _, ...withoutPassword } = saved
    return withoutPassword
  }

  // Vô hiệu hóa user (soft delete)
  async removeAdmin(id: string): Promise<void> {
    const user = await this.findById(id)
    user.isActive = false
    await this.usersRepository.save(user)
  }
}
