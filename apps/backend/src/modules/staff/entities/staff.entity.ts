import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '../../users/entities/user.entity'
import { Gender } from '../../../common/enums/gender.enum'

// Chức vụ của nhân viên trong spa
export enum StaffPosition {
  TECHNICIAN = 'TECHNICIAN',      // Kỹ thuật viên
  RECEPTIONIST = 'RECEPTIONIST',  // Lễ tân
  MANAGER = 'MANAGER',            // Quản lý
  CASHIER = 'CASHIER',            // Thu ngân
}

@Entity('staff')
export class Staff {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Liên kết 1-1 với tài khoản users
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'user_id' })
  userId: string

  // Chi nhánh nhân viên thuộc về
  @Column({ nullable: true, name: 'branch_id' })
  branchId: string

  @Column()
  fullName: string

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender | null

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null

  @Column({ type: 'text', nullable: true })
  address: string

  @Column({ type: 'enum', enum: StaffPosition, nullable: true })
  position: StaffPosition | null

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  salary: number | null

  @Column({ type: 'date', nullable: true })
  hiredDate: Date | null

  @UpdateDateColumn()
  updatedAt: Date
}
