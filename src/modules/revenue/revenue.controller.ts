import { Controller, Get } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueStatsDto } from './dto/revenue-stats.dto';

@Controller('revenue')
export class RevenueController {
  constructor(private readonly revenueService: RevenueService) {}

  // Получение общей статистики по выручке
  @Get()
  async getRevenueStats(): Promise<RevenueStatsDto> {
    return this.revenueService.getRevenueStats();
  }

  // Получение общей выручки за последние 30 дней
  @Get('total')
  async getTotalRevenue(): Promise<number> {
    return this.revenueService.getTotalRevenue();
  }

  // Получение выручки по продуктам за последние 30 дней
  @Get('by-product')
  async getRevenueByProduct(): Promise<any[]> {
    return this.revenueService.getRevenueByProduct();
  }

  // Получение выручки по категориям за последние 30 дней
  @Get('by-category')
  async getRevenueByCategory(): Promise<any[]> {
    return this.revenueService.getRevenueByCategory();
  }

  // Получение самых активных клиентов за последние 30 дней
  @Get('active-clients')
  async getMostActiveClients(): Promise<any[]> {
    return this.revenueService.getMostActiveClients();
  }

  // Получение продуктов с низким запасом
  @Get('low-stock')
  async getLowStockProducts(): Promise<any[]> {
    return this.revenueService.getLowStockProducts();
  }
}
