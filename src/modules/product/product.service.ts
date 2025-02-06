import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Product } from '@prisma/client';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllProducts(): Promise<Product[]> {
    return this.databaseService.product.findMany();
  }

  async getOneProductById(productId: number): Promise<Product | null> {
    return this.databaseService.product.findUnique({
      where: { id: productId },
    });
  }

  async createProduct(dto: ProductDto): Promise<Product> {
    return this.databaseService.product.create({
      data: {
        ...dto,
      },
    });
  }

  async updateProduct(productId: number, dto: ProductDto): Promise<Product> {
    return this.databaseService.product.update({
      where: { id: productId },
      data: dto,
    });
  }

  async deleteProduct(productId: number): Promise<Product | null> {
    return this.databaseService.product.delete({
      where: { id: productId },
    });
  }
}
