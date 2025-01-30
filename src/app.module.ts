import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ShiftModule } from './modules/shift/shift.module';
import { BookingModule } from './modules/booking/booking.module';
import { RoomModule } from './modules/room/room.module';
import { LocationModule } from './modules/location/location.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { ClientModule } from './modules/client/client.module';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [DatabaseModule, AuthModule, UserModule, EmployeeModule, ShiftModule, BookingModule, RoomModule, LocationModule, ProductModule, CategoryModule, ClientModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
