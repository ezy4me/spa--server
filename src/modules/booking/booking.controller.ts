import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { Booking } from '@prisma/client';
import { BookingDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('booking')
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Public()
  @Get()
  async getAllBookings(): Promise<Booking[]> {
    return this.bookingService.getAllBookings();
  }

  @Public()
  @Get(':bookingId')
  async getOneBookingById(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<Booking | null> {
    return this.bookingService.getOneBookingById(bookingId);
  }

  @Post()
  async createBooking(@Body() bookingDto: BookingDto): Promise<Booking> {
    return this.bookingService.createBooking(bookingDto);
  }

  @Put(':bookingId')
  async updateBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
    @Body() bookingDto: BookingDto,
  ): Promise<Booking> {
    return this.bookingService.updateBooking(bookingId, bookingDto);
  }

  @Delete(':bookingId')
  async deleteBooking(
    @Param('bookingId', ParseIntPipe) bookingId: number,
  ): Promise<Booking | null> {
    return this.bookingService.deleteBooking(bookingId);
  }
}
