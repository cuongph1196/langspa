import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ReportsService } from './reports.service'
import { ReportsController } from './reports.controller'
import { Booking } from '../bookings/entities/booking.entity'
import { User } from '../users/entities/user.entity'
import { SpaService } from '../services/entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, SpaService])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
