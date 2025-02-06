import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Room } from '@prisma/client';
import { RoomDto } from './dto';

@Injectable()
export class RoomService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllRooms(): Promise<Room[]> {
    return this.databaseService.room.findMany({
      include: {
        location: true,
      },
    });
  }

  async getOneRoomById(roomId: number): Promise<Room | null> {
    return this.databaseService.room.findUnique({
      where: { id: roomId },
      include: {
        location: true,
      },
    });
  }

  async createRoom(dto: RoomDto): Promise<Room> {
    return this.databaseService.room.create({
      data: {
        ...dto,
      },
    });
  }

  async updateRoom(roomId: number, dto: RoomDto): Promise<Room> {
    return this.databaseService.room.update({
      where: { id: roomId },
      data: dto,
    });
  }

  async deleteRoom(roomId: number): Promise<Room | null> {
    return this.databaseService.room.delete({
      where: { id: roomId },
    });
  }
}
