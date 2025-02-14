import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ShiftDto {
  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  userId?: number;
}
