import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsString } from 'class-validator';

class LowStockProduct {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  stock: number;
}

export class DashboardStatsDto {
  @ApiProperty()
  @IsNumber()
  revenue: number;

  @ApiProperty()
  @IsNumber()
  totalClients: number;

  @ApiProperty()
  @IsNumber()
  clientsLast30Days: number;

  @ApiProperty({ type: [LowStockProduct] })
  @IsArray()
  lowStockProducts: LowStockProduct[];

  @ApiProperty()
  @IsNumber()
  activeBookings: number;
}
