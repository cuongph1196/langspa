import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ServicesModule } from './modules/services/services.module'
import { BookingsModule } from './modules/bookings/bookings.module'
import { ProductsModule } from './modules/products/products.module'
import { BranchesModule } from './modules/branches/branches.module'
import { ReportsModule } from './modules/reports/reports.module'
import { StaffModule } from './modules/staff/staff.module'
import { CustomersModule } from './modules/customers/customers.module'

@Module({
  imports: [
    // Cấu hình biến môi trường toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Kết nối database PostgreSQL qua TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'admin'),
        password: configService.get('DB_PASSWORD', 'Lang202604@'),
        database: configService.get('DB_DATABASE', 'langspa'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ServicesModule,
    BookingsModule,
    ProductsModule,
    BranchesModule,
    ReportsModule,
    StaffModule,
    CustomersModule,
  ],
})
export class AppModule {}
