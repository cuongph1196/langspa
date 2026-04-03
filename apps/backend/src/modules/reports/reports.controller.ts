import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { ReportsService } from './reports.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'

@ApiTags('Admin - Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // GET /api/admin/reports/dashboard - KPI tổng hợp
  @Get('dashboard')
  @ApiOperation({ summary: 'KPI dashboard: booking hôm nay, doanh thu tháng, khách mới...' })
  getDashboard() {
    return this.reportsService.getDashboard()
  }

  // GET /api/admin/reports/revenue - Doanh thu theo kỳ
  @Get('revenue')
  @ApiOperation({ summary: 'Doanh thu theo kỳ (ngày/tuần/tháng/năm)' })
  @ApiQuery({ name: 'from', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'period', required: false, enum: ['day', 'week', 'month', 'year'], description: 'Độ phân giải thời gian' })
  getRevenue(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month',
  ) {
    return this.reportsService.getRevenue(from, to, period)
  }

  // GET /api/admin/reports/bookings - Thống kê lịch hẹn
  @Get('bookings')
  @ApiOperation({ summary: 'Thống kê lịch hẹn (tổng, theo status, theo ngày)' })
  @ApiQuery({ name: 'from', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: true, description: 'YYYY-MM-DD' })
  getBookingsStats(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.getBookingsStats(from, to)
  }

  // GET /api/admin/reports/customers - Thống kê khách hàng
  @Get('customers')
  @ApiOperation({ summary: 'Thống kê khách hàng mới và phân khúc membership' })
  @ApiQuery({ name: 'from', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: true, description: 'YYYY-MM-DD' })
  getCustomersStats(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.reportsService.getCustomersStats(from, to)
  }

  // GET /api/admin/reports/services - Dịch vụ phổ biến nhất
  @Get('services')
  @ApiOperation({ summary: 'Top dịch vụ được đặt nhiều nhất' })
  @ApiQuery({ name: 'from', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'to', required: true, description: 'YYYY-MM-DD' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số lượng kết quả (mặc định 10)' })
  getTopServices(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('limit') limit = 10,
  ) {
    return this.reportsService.getTopServices(from, to, +limit)
  }
}
