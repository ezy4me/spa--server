import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ClientDto {
  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsString()
  comment: string;
}
