import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

// Loại tài khoản: nhân viên hoặc khách hàng
export enum UserType {
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

// Vai trò phân quyền, chỉ áp dụng cho nhân viên
export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string // bcrypt hashed

  @Column({ nullable: true, unique: true })
  phone: string

  @Column({ nullable: true })
  avatar: string

  // Loại tài khoản: STAFF hoặc CUSTOMER
  @Column({ type: 'enum', enum: UserType })
  type: UserType

  // Vai trò phân quyền — NULL nếu type = CUSTOMER
  @Column({ type: 'enum', enum: UserRole, nullable: true })
  role: UserRole | null

  @Column({ default: true })
  isActive: boolean

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
