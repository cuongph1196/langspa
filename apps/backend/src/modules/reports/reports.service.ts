import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from '../bookings/entities/booking.entity'
import { User } from '../users/entities/user.entity'
import { SpaService } from '../services/entities/service.entity'

type Period = 'day' | 'week' | 'month' | 'year'

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(SpaService)
    private readonly serviceRepo: Repository<SpaService>,
  ) {}

  // Tổng hợp KPI cho dashboard
  async getDashboard() {
    const today = new Date().toISOString().split('T')[0]
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [
      bookingsToday,
      bookingsPendingToday,
      newUsersThisMonth,
      totalUsers,
      totalActiveServices,
    ] = await Promise.all([
      this.bookingRepo.count({ where: { bookingDate: today } }),
      this.bookingRepo.count({ where: { bookingDate: today, status: 'PENDING' } }),
      this.userRepo
        .createQueryBuilder('u')
        .where('u.createdAt >= :from', { from: firstDayOfMonth })
        .getCount(),
      this.userRepo.count(),
      this.serviceRepo.count({ where: { isActive: true } }),
    ])

    // Doanh thu tháng này (booking COMPLETED, join với giá dịch vụ)
    const revenueResult = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin(SpaService, 's', 's.id = b.serviceId')
      .select('COALESCE(SUM(CAST(s.price AS DECIMAL)), 0)', 'revenue')
      .where("b.status = 'COMPLETED'")
      .andWhere('b.createdAt >= :from', { from: firstDayOfMonth })
      .getRawOne()

    // Bookings theo trạng thái (tháng này)
    const statusStats = await this.bookingRepo
      .createQueryBuilder('b')
      .select('b.status', 'status')
      .addSelect('COUNT(b.id)', 'count')
      .where('b.createdAt >= :from', { from: firstDayOfMonth })
      .groupBy('b.status')
      .getRawMany()

    return {
      bookingsToday,
      bookingsPendingToday,
      newUsersThisMonth,
      totalUsers,
      totalActiveServices,
      revenueThisMonth: parseFloat(revenueResult?.revenue ?? '0'),
      bookingsByStatus: statusStats.map(s => ({
        status: s.status,
        count: parseInt(s.count, 10),
      })),
    }
  }

  // Doanh thu theo kỳ
  async getRevenue(from: string, to: string, period: Period = 'month') {
    const truncFn = {
      day: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
    }[period]

    const rows = await this.bookingRepo
      .createQueryBuilder('b')
      .innerJoin(SpaService, 's', 's.id = b.serviceId')
      .select(`DATE_TRUNC('${truncFn}', b.createdAt)`, 'period')
      .addSelect('COALESCE(SUM(CAST(s.price AS DECIMAL)), 0)', 'revenue')
      .addSelect('COUNT(b.id)', 'count')
      .where("b.status = 'COMPLETED'")
      .andWhere('b.createdAt BETWEEN :from AND :toDate', {
        from: new Date(from),
        toDate: new Date(to + 'T23:59:59'),
      })
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany()

    return rows.map(r => ({
      period: r.period,
      revenue: parseFloat(r.revenue),
      count: parseInt(r.count, 10),
    }))
  }

  // Thống kê booking theo kỳ
  async getBookingsStats(from: string, to: string) {
    const [total, byStatus, daily] = await Promise.all([
      this.bookingRepo
        .createQueryBuilder('b')
        .where('b.createdAt BETWEEN :from AND :to', {
          from: new Date(from),
          to: new Date(to + 'T23:59:59'),
        })
        .getCount(),

      this.bookingRepo
        .createQueryBuilder('b')
        .select('b.status', 'status')
        .addSelect('COUNT(b.id)', 'count')
        .where('b.createdAt BETWEEN :from AND :to', {
          from: new Date(from),
          to: new Date(to + 'T23:59:59'),
        })
        .groupBy('b.status')
        .getRawMany(),

      this.bookingRepo
        .createQueryBuilder('b')
        .select("DATE_TRUNC('day', b.createdAt)", 'date')
        .addSelect('COUNT(b.id)', 'count')
        .where('b.createdAt BETWEEN :from AND :to', {
          from: new Date(from),
          to: new Date(to + 'T23:59:59'),
        })
        .groupBy('date')
        .orderBy('date', 'ASC')
        .getRawMany(),
    ])

    return {
      total,
      byStatus: byStatus.map(s => ({ status: s.status, count: parseInt(s.count, 10) })),
      daily: daily.map(d => ({ date: d.date, count: parseInt(d.count, 10) })),
    }
  }

  // Thống kê khách hàng
  async getCustomersStats(from: string, to: string) {
    const [newCustomers, membershipBreakdown] = await Promise.all([
      this.userRepo
        .createQueryBuilder('u')
        .where('u.createdAt BETWEEN :from AND :to', {
          from: new Date(from),
          to: new Date(to + 'T23:59:59'),
        })
        .getCount(),

      this.userRepo
        .createQueryBuilder('u')
        .select('u.membershipLevel', 'membershipLevel')
        .addSelect('COUNT(u.id)', 'count')
        .groupBy('u.membershipLevel')
        .getRawMany(),
    ])

    return {
      newCustomers,
      membershipBreakdown: membershipBreakdown.map(m => ({
        level: m.membershipLevel,
        count: parseInt(m.count, 10),
      })),
    }
  }

  // Dịch vụ phổ biến nhất
  async getTopServices(from: string, to: string, limit = 10) {
    const rows = await this.bookingRepo
      .createQueryBuilder('b')
      .leftJoin(SpaService, 's', 's.id = b.serviceId')
      .select('b.serviceId', 'serviceId')
      .addSelect('s.name', 'serviceName')
      .addSelect('COUNT(b.id)', 'bookingCount')
      .addSelect('COALESCE(SUM(CAST(s.price AS DECIMAL)), 0)', 'revenue')
      .where('b.createdAt BETWEEN :from AND :to', {
        from: new Date(from),
        to: new Date(to + 'T23:59:59'),
      })
      .groupBy('b.serviceId')
      .addGroupBy('s.name')
      .orderBy('bookingCount', 'DESC')
      .limit(limit)
      .getRawMany()

    return rows.map(r => ({
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      bookingCount: parseInt(r.bookingCount, 10),
      revenue: parseFloat(r.revenue),
    }))
  }
}
