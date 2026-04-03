import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from 'src/common/decorators/current-user.decorator'

@ApiTags('Admin - Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/bookings')
export class BookingsAdminController {
  constructor(private readonly bookingsService: BookingsService) {}

  // GET /api/admin/bookings - Danh sách tất cả lịch hẹn (có filter)
  @Get()
  @ApiOperation({ summary: 'Danh sách tất cả lịch hẹn (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] })
  @ApiQuery({ name: 'date', required: false, description: 'Lọc theo ngày YYYY-MM-DD' })
  @ApiQuery({ name: 'branchId', required: false })
  @ApiQuery({ name: 'userId', required: false })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('status') status?: string,
    @Query('date') date?: string,
    @Query('branchId') branchId?: string,
    @Query('userId') userId?: string,
    @CurrentUser() currentUser?: { userId: string },
  ) {
    debugger
    console.log(currentUser?.userId)
    return this.bookingsService.findAllAdmin({
      page: +page,
      limit: +limit,
      status,
      date,
      branchId,
      userId,
    })
  }

  // GET /api/admin/bookings/calendar - Lịch hẹn theo ngày (calendar view)
  // PHẢI đặt TRƯỚC :id để tránh conflict route
  @Get('calendar')
  @ApiOperation({ summary: 'Lịch hẹn theo ngày (calendar view)' })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD, mặc định hôm nay' })
  getCalendar(@Query('date') date?: string) {
    const targetDate = date ?? new Date().toISOString().split('T')[0]
    return this.bookingsService.getCalendar(targetDate)
  }

  // GET /api/admin/bookings/:id - Chi tiết lịch hẹn
  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết lịch hẹn' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bookingsService.findById(id)
  }

  // PATCH /api/admin/bookings/:id/status - Cập nhật trạng thái
  @Patch(':id/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái lịch hẹn' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto.status)
  }
}
