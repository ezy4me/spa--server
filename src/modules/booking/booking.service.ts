import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Booking } from '@prisma/client';
import { BookingDto } from './dto';

@Injectable()
export class BookingService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllBookings(): Promise<Booking[]> {
    return this.databaseService.booking.findMany({
      include: {
        client: true,
        room: true,
      },
    });
  }

  async getOneBookingById(bookingId: number): Promise<Booking | null> {
    return this.databaseService.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        room: true,
      },
    });
  }

  async createBooking(dto: BookingDto): Promise<Booking> {
    return this.databaseService.booking.create({
      data: {
        ...dto,
      },
    });
  }

  async updateBooking(bookingId: number, dto: BookingDto): Promise<Booking> {
    console.log(dto);

    return this.databaseService.booking.update({
      where: { id: bookingId },
      data: dto,
    });
  }

  async deleteBooking(bookingId: number): Promise<Booking | null> {
    return this.databaseService.booking.delete({
      where: { id: bookingId },
    });
  }

  async updateBookingStatus(
    bookingId: number,
    status: string,
  ): Promise<Booking> {
    return this.databaseService.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }

  async extendBooking(bookingId: number, endTime: Date): Promise<Booking> {
    return this.databaseService.booking.update({
      where: { id: bookingId },
      data: { endTime: endTime },
    });
  }
}
