import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

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
    enum: ['STANDARD', 'SILVER', 'GOLD', 'VIP'],
    default: 'STANDARD',
  })
  membershipLevel: string

  @Column({ default: 0 })
  points: number

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
