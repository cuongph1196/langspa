import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

// DTO cập nhật profile
interface UpdateUserDto {
  fullName?: string
  phone?: string
}

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

  // Tạo user mới
  async create(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(data)
    return this.usersRepository.save(user)
  }

  // Cập nhật thông tin user
  async update(id: string, data: UpdateUserDto): Promise<User> {
    await this.usersRepository.update(id, data)
    return this.findById(id)
  }
}
