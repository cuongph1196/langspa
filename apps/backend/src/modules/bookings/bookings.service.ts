import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Booking } from './entities/booking.entity'

// DTO tạo đặt lịch
interface CreateBookingData {
  serviceId: string
  branchId: string
  bookingDate: string
  timeSlot: string
  fullName: string
  phone: string
  email: string
  notes?: string
  userId?: string
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
      customerName: data.fullName,
      customerPhone: data.phone,
      customerEmail: data.email,
      status: 'PENDING',
    })
    return this.bookingsRepository.save(booking)
  }

  // Lấy danh sách đặt lịch của user
  async findByUser(userId: string): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    })
  }

  // Lấy tất cả đặt lịch (admin)
  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  // Cập nhật trạng thái đặt lịch
  async updateStatus(id: string, status: string): Promise<Booking> {
    await this.bookingsRepository.update(id, { status })
    const booking = await this.bookingsRepository.findOne({ where: { id } })
    if (!booking) throw new NotFoundException('Không tìm thấy lịch hẹn')
    return booking
  }
}
