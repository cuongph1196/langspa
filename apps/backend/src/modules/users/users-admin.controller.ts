import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { AdminUpdateUserDto } from './dto/admin-update-user.dto'
import { UserRole, UserType } from './entities/user.entity'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Admin - Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/users')
export class UsersAdminController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/admin/users - Danh sách user (nhân viên)
  @Get()
  @ApiOperation({ summary: 'Danh sách user (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, description: 'Tìm theo email' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole, description: 'Lọc theo vai trò' })
  @ApiQuery({ name: 'type', required: false, enum: UserType, description: 'Lọc theo loại tài khoản' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('search') search?: string,
    @Query('role') role?: UserRole,
    @Query('type') type?: UserType,
  ) {
    return this.usersService.findAllAdmin({ page: +page, limit: +limit, search, role, type })
  }

  // GET /api/admin/users/:id - Chi tiết user
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết user' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.findById(id)
    const { password: _, ...withoutPassword } = user as any
    return withoutPassword
  }

  // POST /api/admin/users - Tạo user mới (admin tạo nhân viên)
  @Post()
  @ApiOperation({ summary: 'Tạo user mới (admin)' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createAdmin(dto)
  }

  // PATCH /api/admin/users/:id - Cập nhật thông tin user
  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin user (admin)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdminUpdateUserDto,
  ) {
    return this.usersService.adminUpdate(id, dto)
  }

  // DELETE /api/admin/users/:id - Vô hiệu hóa user (soft delete)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Vô hiệu hóa user (soft delete, isActive = false)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.removeAdmin(id)
  }
}
