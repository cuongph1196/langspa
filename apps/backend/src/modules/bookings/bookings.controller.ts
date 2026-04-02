import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger'
import { BookingsService } from './bookings.service'
import { CreateBookingDto } from './dto/create-booking.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // POST /api/bookings - Tạo đặt lịch (không cần auth, guest booking)
  @Post()
  @ApiOperation({ summary: 'Tạo lịch hẹn mới (có thể là khách vãng lai)' })
  async create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto)
  }

  // GET /api/bookings/my - Lịch của user đang đăng nhập
  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách lịch hẹn của tôi' })
  async getMyBookings(@CurrentUser() user: { userId: string }) {
    return this.bookingsService.findByUser(user.userId)
  }

  // PATCH /api/bookings/:id/cancel - Hủy lịch hẹn
  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Hủy lịch hẹn' })
  async cancel(@Param('id') id: string) {
    return this.bookingsService.updateStatus(id, 'CANCELLED')
  }
}
