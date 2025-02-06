import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class BookingDto {
  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNumber()
  roomId: number;

  @ApiProperty()
  @IsNumber()
  clientId: number;
}
