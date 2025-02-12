import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { RevenueStatsDto } from './dto/revenue-stats.dto';

@Injectable()
export class RevenueService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Получение общей выручки за последние 30 дней
  async getTotalRevenue(): Promise<number> {
    try {
      const currentDate = new Date();
      const last30DaysDate = new Date(currentDate);
      last30DaysDate.setDate(currentDate.getDate() - 30);

      const revenue = await this.databaseService.transaction.aggregate({
        _sum: {
          amount: true,
        },
        where: {
          date: {
            gte: last30DaysDate,
          },
        },
      });

      return revenue._sum.amount ?? 0;
    } catch (error) {
      console.error('Error fetching total revenue:', error);
      throw new Error('Error fetching total revenue');
    }
  }

  // Получение выручки по продуктам за последние 30 дней
  async getRevenueByProduct(): Promise<any[]> {
    try {
      const currentDate = new Date();
      const last30DaysDate = new Date(currentDate);
      last30DaysDate.setDate(currentDate.getDate() - 30);

      const revenueByProduct =
        await this.databaseService.transactionProducts.findMany({
          where: {
            transaction: {
              date: {
                gte: last30DaysDate,
              },
            },
          },
          select: {
            productId: true,
            product: {
              select: {
                name: true,
                price: true,
              },
            },
            quantity: true,
          },
        });

      const result = revenueByProduct.map((item) => ({
        name: item.product.name,
        totalRevenue: item.quantity * item.product.price,
      }));

      return result;
    } catch (error) {
      console.error('Error fetching revenue by product:', error);
      throw new Error('Error fetching revenue by product');
    }
  }

  // Получение выручки по категориям за последние 30 дней
  async getRevenueByCategory(): Promise<any[]> {
    try {
      const currentDate = new Date();
      const last30DaysDate = new Date(currentDate);
      last30DaysDate.setDate(currentDate.getDate() - 30);

      const revenueByCategory =
        await this.databaseService.transactionProducts.findMany({
          where: {
            transaction: {
              date: {
                gte: last30DaysDate,
              },
            },
          },
          select: {
            product: {
              select: {
                categoryId: true,
                price: true,
              },
            },
            quantity: true,
          },
        });

      const categoryRevenue = {};

      revenueByCategory.forEach((item) => {
        const categoryId = item.product.categoryId;
        const price = item.product.price;
        if (!categoryRevenue[categoryId]) {
          categoryRevenue[categoryId] = 0;
        }
        categoryRevenue[categoryId] += item.quantity * price;
      });

      const categories = await this.databaseService.category.findMany({
        where: {
          id: {
            in: Object.keys(categoryRevenue).map(Number),
          },
        },
        select: {
          id: true,
          name: true,
        },
      });

      return categories.map((category) => ({
        categoryName: category.name,
        totalRevenue: categoryRevenue[category.id],
      }));
    } catch (error) {
      console.error('Error fetching revenue by category:', error);
      throw new Error('Error fetching revenue by category');
    }
  }

  // Получение самых активных клиентов за последние 30 дней
  async getMostActiveClients(): Promise<any[]> {
    try {
      const currentDate = new Date();
      const last30DaysDate = new Date(currentDate);
      last30DaysDate.setDate(currentDate.getDate() - 30);

      const activeClients = await this.databaseService.client.findMany({
        where: {
          Transaction: {
            some: {
              date: {
                gte: last30DaysDate,
              },
            },
          },
        },
        select: {
          id: true,
          fullName: true,
          _count: {
            select: {
              Transaction: true,
            },
          },
        },
        take: 5,
      });

      return activeClients;
    } catch (error) {
      console.error('Error fetching active clients:', error);
      throw new Error('Error fetching active clients');
    }
  }

  // Получение продуктов с низким запасом (менее 15 единиц)
  async getLowStockProducts(): Promise<any[]> {
    try {
      const lowStock = await this.databaseService.product.findMany({
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

      return lowStock;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw new Error('Error fetching low stock products');
    }
  }

  // Получение общей статистики по выручке
  async getRevenueStats(): Promise<RevenueStatsDto> {
    try {
      const totalRevenue = await this.getTotalRevenue();
      const revenueByProduct = await this.getRevenueByProduct();
      const revenueByCategory = await this.getRevenueByCategory();
      const mostActiveClients = await this.getMostActiveClients();
      const lowStockProducts = await this.getLowStockProducts();

      return {
        totalRevenue,
        revenueByProduct,
        revenueByCategory,
        mostActiveClients,
        lowStockProducts,
      };
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      throw new Error('Error fetching revenue stats');
    }
  }
}
