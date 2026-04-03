import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, ILike, FindOptionsWhere } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { User, UserRole, UserType } from './entities/user.entity'

// DTO cập nhật profile
interface UpdateUserDto {
  phone?: string
  avatar?: string
}

const USER_SAFE_SELECT: (keyof User)[] = [
  'id', 'email', 'phone', 'avatar', 'type', 'role',
  'isActive', 'lastLoginAt', 'createdAt', 'updatedAt',
]

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // Tìm user theo email (không bao gồm password)
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  // Tìm user theo email kèm password (dùng cho xác thực đăng nhập)
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne()
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
    type?: UserType
  }) {
    const { page = 1, limit = 15, search, role, type } = options
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<User> = {}
    if (role) where.role = role
    if (type) where.type = type

    const qb = this.usersRepository.createQueryBuilder('user')
    if (search) {
      qb.where('user.email ILIKE :search', { search: `%${search}%` })
    }
    if (role) qb.andWhere('user.role = :role', { role })
    if (type) qb.andWhere('user.type = :type', { type })

    const [items, total] = await qb
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount()

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Tạo user mới từ admin (hash password)
  async createAdmin(data: {
    email: string
    password: string
    phone?: string
    type: UserType
    role?: UserRole
    avatar?: string
  }): Promise<Omit<User, 'password'>> {
    const exists = await this.usersRepository.findOne({ where: { email: data.email } })
    if (exists) throw new ConflictException('Email đã tồn tại')
    const hashed = await bcrypt.hash(data.password, 10)
    const user = this.usersRepository.create({ ...data, password: hashed })
    const saved = await this.usersRepository.save(user)
    const { password: _, ...withoutPassword } = saved as any
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
    const { password: _, ...withoutPassword } = saved as any
    return withoutPassword
  }

  // Vô hiệu hóa user (soft delete)
  async removeAdmin(id: string): Promise<void> {
    const user = await this.findById(id)
    user.isActive = false
    await this.usersRepository.save(user)
  }
}
