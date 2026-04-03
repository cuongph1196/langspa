import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BookingsService } from './bookings.service'
import { BookingsController } from './bookings.controller'
import { BookingsAdminController } from './bookings-admin.controller'
import { Booking } from './entities/booking.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Booking])],
  providers: [BookingsService],
  controllers: [BookingsController, BookingsAdminController],
  exports: [BookingsService],
})
export class BookingsModule {}
