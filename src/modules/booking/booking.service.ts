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
    const booking = await this.databaseService.booking.create({
      data: {
        ...dto,
      },
    });

    await this.updateRoomStatus(booking.roomId, dto.status);

    return booking;
  }

  async updateBooking(bookingId: number, dto: BookingDto): Promise<Booking> {
    const updatedBooking = await this.databaseService.booking.update({
      where: { id: bookingId },
      data: dto,
    });

    if (dto.status) {
      await this.updateRoomStatus(updatedBooking.roomId, dto.status);
    }

    return updatedBooking;
  }

  async deleteBooking(bookingId: number): Promise<Booking | null> {
    const booking = await this.databaseService.booking.delete({
      where: { id: bookingId },
    });

    await this.updateRoomStatus(booking.roomId, 'Свободна');

    return booking;
  }

  async updateBookingStatus(
    bookingId: number,
    status: string,
  ): Promise<Booking> {
    const booking = await this.databaseService.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    await this.updateRoomStatus(booking.roomId, status);

    return booking;
  }

  async extendBooking(bookingId: number, endTime: Date): Promise<Booking> {
    return this.databaseService.booking.update({
      where: { id: bookingId },
      data: { endTime: endTime },
    });
  }

  private async updateRoomStatus(roomId: number, status: string) {
    let roomStatus = status;

    if (status === 'Оплачено' || status === 'Завершен') {
      roomStatus = 'Занята';
    } else if (status === 'Резерв') {
      roomStatus = 'Зарезервирована';
    } else if (status === 'Отменен') {
      roomStatus = 'Свободна';
    }

    await this.databaseService.room.update({
      where: { id: roomId },
      data: { status: roomStatus },
    });
  }
}
