import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, FindOptionsWhere } from 'typeorm'
import { Booking, BookingStatus } from './entities/booking.entity'

// DTO tạo đặt lịch
interface CreateBookingData {
  serviceId: string
  branchId: string
  bookingDate: string
  timeSlot: string
  notes?: string
  // Khách hàng đã đăng ký
  customerId?: string
  staffId?: string
  // Khách vãng lai chưa đăng ký
  guestName?: string
  guestPhone?: string
  guestEmail?: string
  createdBy?: string
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
  ) {}

  // Tạo đặt lịch mới (có thể là guest)
  async create(data: CreateBookingData): Promise<Booking> {
    const booking = this.bookingsRepository.create({
      serviceId: data.serviceId,
      branchId: data.branchId,
      bookingDate: data.bookingDate,
      timeSlot: data.timeSlot,
      notes: data.notes,
      customerId: data.customerId ?? null,
      staffId: data.staffId ?? null,
      guestName: data.guestName ?? null,
      guestPhone: data.guestPhone ?? null,
      guestEmail: data.guestEmail ?? null,
      createdBy: data.createdBy ?? null,
      status: BookingStatus.PENDING,
    })
    return this.bookingsRepository.save(booking)
  }

  // Lấy danh sách đặt lịch của khách hàng
  async findByCustomer(customerId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { customerId },
      order: { createdAt: 'DESC' },
    })
  }

  // Lấy tất cả đặt lịch (admin, có pagination + filter)
  async findAllAdmin(options: {
    page?: number
    limit?: number
    status?: string
    date?: string
    branchId?: string
    customerId?: string
  }) {
    const { page = 1, limit = 15, status, date, branchId, customerId } = options
    const skip = (page - 1) * limit

    const where: FindOptionsWhere<Booking> = {}
    if (status) where.status = status as BookingStatus
    if (date) where.bookingDate = date
    if (branchId) where.branchId = branchId
    if (customerId) where.customerId = customerId

    const [items, total] = await this.bookingsRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    })

    return { items, total, page, totalPages: Math.ceil(total / limit) }
  }

  // Lấy tất cả đặt lịch (admin, không phân trang - legacy)
  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  // Tìm lịch hẹn theo ID
  async findById(id: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } })
    if (!booking) throw new NotFoundException('Không tìm thấy lịch hẹn')
    return booking
  }

  // Lấy lịch hẹn theo ngày (calendar view)
  async getCalendar(date: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { bookingDate: date },
      order: { timeSlot: 'ASC' },
    })
  }

  // Cập nhật trạng thái đặt lịch
  async updateStatus(id: string, status: string): Promise<Booking> {
    await this.bookingsRepository.update(id, { status: status as BookingStatus })
    const booking = await this.bookingsRepository.findOne({ where: { id } })
    if (!booking) throw new NotFoundException('Không tìm thấy lịch hẹn')
    return booking
  }
}
