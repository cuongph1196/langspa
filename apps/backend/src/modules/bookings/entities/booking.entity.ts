import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { Customer } from '../../customers/entities/customer.entity'
import { Staff } from '../../staff/entities/staff.entity'

// Trạng thái lịch hẹn
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Khách hàng đã có tài khoản — nullable nếu là khách vãng lai
  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null

  @Column({ name: 'customer_id', nullable: true })
  customerId: string | null

  // Thông tin khách vãng lai chưa đăng ký
  @Column({ nullable: true })
  guestName: string | null

  @Column({ nullable: true })
  guestPhone: string | null

  @Column({ nullable: true })
  guestEmail: string | null

  // Nhân viên thực hiện dịch vụ
  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff | null

  @Column({ name: 'staff_id', nullable: true })
  staffId: string | null

  @Column({ name: 'service_id' })
  serviceId: string

  @Column({ name: 'branch_id' })
  branchId: string

  @Column({ type: 'date' })
  bookingDate: string

  @Column()
  timeSlot: string

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus

  @Column({ type: 'text', nullable: true })
  notes: string | null

  // Nhân viên tạo lịch hộ (FK → users.id)
  @Column({ name: 'created_by', nullable: true })
  createdBy: string | null

  @CreateDateColumn()
  createdAt: Date
}
