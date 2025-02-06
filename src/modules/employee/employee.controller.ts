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
import { EmployeeService } from './employee.service';
import { Employee } from '@prisma/client';
import { EmployeeDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employee')
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Public()
  @Get()
  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeService.getAllEmployees();
  }

  @Public()
  @Get(':employeeId')
  async getOneEmployeeById(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<Employee | null> {
    return this.employeeService.getOneEmployeeById(employeeId);
  }

  @Post()
  async createEmployee(@Body() employeeDto: EmployeeDto): Promise<Employee> {
    return this.employeeService.createEmployee(employeeDto);
  }

  @Put(':employeeId')
  async updateEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Body() employeeDto: EmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.updateEmployee(employeeId, employeeDto);
  }

  @Delete(':employeeId')
  async deleteEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<Employee | null> {
    return this.employeeService.deleteEmployee(employeeId);
  }
}
