import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { BranchesService } from './branches.service'

@ApiTags('Branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  // GET /api/branches - Danh sách tất cả chi nhánh đang hoạt động
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách chi nhánh' })
  async findAll() {
    return this.branchesService.findAll()
  }
}
