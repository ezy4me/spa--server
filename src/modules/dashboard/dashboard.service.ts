import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { DashboardStatsDto } from './dto';

@Injectable()
export class DashboardService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const revenue = await this.databaseService.transaction.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        date: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
    });

    const totalClients = await this.databaseService.client.count();
    const clientsLast30Days = await this.databaseService.client.count({
      where: {
        Booking: {
          some: {
            startTime: {
              gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            },
          },
        },
      },
    });

    const lowStockProducts = await this.databaseService.product.findMany({
      where: {
        stock: {
          lt: 15,
        },
      },
      select: {
        id: true,
        name: true,
        stock: true,
      },
    });

    const activeBookings = await this.databaseService.booking.count({
      where: {
        status: 'Оплачено',
      },
    });

    return {
      revenue: revenue._sum.amount ?? 0,
      totalClients,
      clientsLast30Days,
      lowStockProducts,
      activeBookings,
    };
  }
}
