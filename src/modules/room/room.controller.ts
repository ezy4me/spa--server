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
import { RoomService } from './room.service';
import { Room } from '@prisma/client';
import { RoomDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Public()
  @Get()
  async getAllRooms(): Promise<Room[]> {
    return this.roomService.getAllRooms();
  }

  @Public()
  @Get(':roomId')
  async getOneRoomById(
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<Room | null> {
    return this.roomService.getOneRoomById(roomId);
  }

  @Post()
  async createRoom(@Body() roomDto: RoomDto): Promise<Room> {
    return this.roomService.createRoom(roomDto);
  }

  @Put(':roomId')
  async updateRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
    @Body() roomDto: RoomDto,
  ): Promise<Room> {
    return this.roomService.updateRoom(roomId, roomDto);
  }

  @Delete(':roomId')
  async deleteRoom(
    @Param('roomId', ParseIntPipe) roomId: number,
  ): Promise<Room | null> {
    return this.roomService.deleteRoom(roomId);
  }
}
