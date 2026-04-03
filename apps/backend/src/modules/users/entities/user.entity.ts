import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  RECEPTIONIST = 'RECEPTIONIST',
  CASHIER = 'CASHIER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string // bcrypt hashed

  @Column()
  fullName: string

  @Column({ nullable: true })
  phone: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole

  @Column({ nullable: true })
  branchId: string

  @Column({ type: 'text', array: true, nullable: true, default: '{}' })
  specialties: string[]

  @Column({ nullable: true })
  avatarUrl: string

  @Column({ nullable: true })
  position: string

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
