import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ServicesService } from './services.service'
import { ServicesController } from './services.controller'
import { ServicesAdminController } from './services-admin.controller'
import { SpaService } from './entities/service.entity'

@Module({
  imports: [TypeOrmModule.forFeature([SpaService])],
  providers: [ServicesService],
  controllers: [ServicesController, ServicesAdminController],
  exports: [ServicesService],
})
export class ServicesModule {}
