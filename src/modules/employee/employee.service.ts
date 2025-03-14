import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Employee } from '@prisma/client';
import { EmployeeDto } from './dto';

@Injectable()
export class EmployeeService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllEmployees(): Promise<Employee[]> {
    return this.databaseService.employee.findMany({
      include: {
        user: true,
        location: true,
      },
    });
  }

  async getOneEmployeeById(employeeId: number): Promise<Employee | null> {
    return this.databaseService.employee.findUnique({
      where: { id: employeeId },
      include: {
        user: true,
        location: true,
      },
    });
  }

  async getOneEmployeeByUserId(userId: number): Promise<Employee | null> {
    return this.databaseService.employee.findUnique({
      where: { userId: userId },
      include: {
        user: true,
        location: true,
      },
    });
  }

  async createEmployee(dto: EmployeeDto): Promise<Employee> {
    return this.databaseService.employee.create({
      data: {
        ...dto,
      },
    });
  }

  async updateEmployee(
    employeeId: number,
    dto: EmployeeDto,
  ): Promise<Employee> {
    return this.databaseService.employee.update({
      where: { id: employeeId },
      data: dto,
    });
  }

  async deleteEmployee(employeeId: number): Promise<Employee | null> {
    return this.databaseService.employee.delete({
      where: { id: employeeId },
    });
  }
}
