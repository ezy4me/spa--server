import { Injectable, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Shift } from '@prisma/client';
import { ShiftDto } from './dto';

@Injectable()
export class ShiftService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllShifts(): Promise<Shift[]> {
    return this.databaseService.shift.findMany({
      include: { employee: true },
    });
  }

  async getOneShiftById(shiftId: number): Promise<Shift | null> {
    return this.databaseService.shift.findUnique({
      where: { id: shiftId },
      include: { employee: true },
    });
  }

  async getShiftsByUserId(userId: number): Promise<Shift[] | null> {
    const employee = await this.databaseService.employee.findUnique({
      where: { userId },
    });
    return this.databaseService.shift.findMany({
      where: { employeeId: employee?.id },
      include: { employee: true },
    });
  }

  async createShift(dto: ShiftDto): Promise<Shift> {
    const userId = dto.userId;

    if (!userId) throw new BadRequestException('User not authenticated');

    const employee = await this.databaseService.employee.findUnique({
      where: { userId },
    });
    if (!employee) throw new BadRequestException('Employee not found');

    return this.databaseService.shift.create({
      data: {
        startTime: dto.startTime,
        endTime: dto.startTime,
        employeeId: employee.id,
      },
    });
  }

  async updateShift(shiftId: number, dto: ShiftDto): Promise<Shift> {
    return this.databaseService.shift.update({
      where: { id: shiftId },
      data: dto,
    });
  }

  async deleteShift(shiftId: number): Promise<Shift | null> {
    return this.databaseService.shift.delete({
      where: { id: shiftId },
    });
  }
}
