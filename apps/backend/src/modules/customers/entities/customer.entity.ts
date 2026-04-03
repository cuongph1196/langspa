import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Gender } from '../../../common/enums/gender.enum'

// Hạng thành viên của khách hàng
export enum MembershipLevel {
  STANDARD = 'STANDARD',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  VIP = 'VIP',
}

// Nguồn khách hàng
export enum CustomerSource {
  WALK_IN = 'WALK_IN',
  BOOKING = 'BOOKING',
  REFERRAL = 'REFERRAL',
}

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Liên kết 1-1 với tài khoản users — NULL nếu khách chưa có tài khoản
  @OneToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null

  @Column({ name: 'user_id', nullable: true })
  userId: string | null

  @Column()
  fullName: string

  @Column({ unique: true })
  phone: string

  @Column({ nullable: true })
  email: string

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ type: 'enum', enum: MembershipLevel, default: MembershipLevel.STANDARD })
  membershipLevel: MembershipLevel

  @Column({ default: 0 })
  points: number

  @Column({ type: 'text', nullable: true })
  notes: string

  @Column({ type: 'enum', enum: CustomerSource, nullable: true })
  source: CustomerSource | null

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date
}
