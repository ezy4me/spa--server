import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class TransactionProductDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;
}

export class TransactionDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  paymentMethod: string;

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsNumber()
  clientId: number;

  @ApiPropertyOptional({ type: [TransactionProductDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TransactionProductDto)
  transactionProducts?: TransactionProductDto[];
}
