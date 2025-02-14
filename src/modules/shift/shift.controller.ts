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
import { ShiftService } from './shift.service';
import { Shift } from '@prisma/client';
import { ShiftDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('shift')
@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Public()
  @Get()
  async getAllShifts(): Promise<Shift[]> {
    return this.shiftService.getAllShifts();
  }

  @Public()
  @Get(':shiftId')
  async getOneShiftById(
    @Param('shiftId', ParseIntPipe) shiftId: number,
  ): Promise<Shift | null> {
    return this.shiftService.getOneShiftById(shiftId);
  }

  @Get('/user/:userId')
  async getShiftsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Shift[] | null> {
    return this.shiftService.getShiftsByUserId(userId);
  }

  @Post()
  async createShift(@Body() shiftDto: ShiftDto): Promise<Shift> {
    return this.shiftService.createShift(shiftDto);
  }

  @Put(':shiftId')
  async updateShift(
    @Param('shiftId', ParseIntPipe) shiftId: number,
    @Body() shiftDto: ShiftDto,
  ): Promise<Shift> {
    return this.shiftService.updateShift(shiftId, shiftDto);
  }

  @Delete(':shiftId')
  async deleteShift(
    @Param('shiftId', ParseIntPipe) shiftId: number,
  ): Promise<Shift | null> {
    return this.shiftService.deleteShift(shiftId);
  }
}
