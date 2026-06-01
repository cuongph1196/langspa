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
import { SpaService } from '../../services/entities/service.entity'
import { Branch } from '../../branches/entities/branch.entity'

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
  id!: string

  // Khách hàng đã có tài khoản — nullable nếu là khách vãng lai
  @ManyToOne(() => Customer, { nullable: true })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer | null

  @Column({ name: 'customer_id', type: 'varchar', nullable: true })
  customerId: string | null

  // Thông tin khách vãng lai chưa đăng ký
  @Column({ type: 'varchar', nullable: true })
  guestName: string | null

  @Column({ type: 'varchar', nullable: true })
  guestPhone: string | null

  @Column({ type: 'varchar', nullable: true })
  guestEmail: string | null

  // Nhân viên thực hiện dịch vụ
  @ManyToOne(() => Staff, { nullable: true })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff | null

  @Column({ name: 'staff_id', type: 'varchar', nullable: true })
  staffId: string | null

  @ManyToOne(() => SpaService, { nullable: false })
  @JoinColumn({ name: 'service_id' })
  service: SpaService

  @Column({ name: 'service_id', type: 'varchar' })
  serviceId: string

  @ManyToOne(() => Branch, { nullable: false })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch

  @Column({ name: 'branch_id', type: 'varchar' })
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
  @Column({ name: 'created_by', type: 'varchar', nullable: true })
  createdBy: string | null

  @CreateDateColumn()
  createdAt: Date
}
