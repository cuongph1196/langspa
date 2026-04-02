import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Branch } from './entities/branch.entity'

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchesRepository: Repository<Branch>,
  ) {}

  // Lấy tất cả chi nhánh đang hoạt động
  async findAll(): Promise<Branch[]> {
    return this.branchesRepository.find({
      where: { isActive: true },
    })
  }

  // Tạo chi nhánh mới
  async create(data: Partial<Branch>): Promise<Branch> {
    const branch = this.branchesRepository.create(data)
    return this.branchesRepository.save(branch)
  }
}
