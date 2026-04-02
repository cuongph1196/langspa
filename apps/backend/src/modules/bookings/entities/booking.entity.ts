import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => User, { nullable: true })
  user: User

  @Column()
  serviceId: string

  @Column()
  branchId: string

  @Column('date')
  bookingDate: string

  @Column()
  timeSlot: string

  @Column({
    type: 'enum',
    enum: ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING',
  })
  status: string

  @Column({ nullable: true })
  notes: string

  @Column()
  customerName: string

  @Column()
  customerPhone: string

  @Column()
  customerEmail: string

  @CreateDateColumn()
  createdAt: Date
}
