import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm'

@Entity('branches')
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  address: string

  @Column({ nullable: true })
  phone: string

  @Column({ default: '08:00' })
  openTime: string

  @Column({ default: '21:00' })
  closeTime: string

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  latitude: number

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  longitude: number

  @Column({ default: true })
  isActive: boolean
}
