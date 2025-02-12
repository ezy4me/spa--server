import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Transaction } from '@prisma/client';
import { TransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.databaseService.transaction.findMany({
      include: {
        client: true,
        TransactionProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async getOneTransactionById(
    transactionId: number,
  ): Promise<Transaction | null> {
    return this.databaseService.transaction.findUnique({
      where: { id: transactionId },
      include: {
        client: true,
        TransactionProducts: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async createTransaction(dto: TransactionDto): Promise<Transaction> {
    const { transactionProducts, ...transactionData } = dto;

    const createdTransaction = await this.databaseService.transaction.create({
      data: {
        ...transactionData,
        TransactionProducts: transactionProducts
          ? {
              create: transactionProducts.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
              })),
            }
          : undefined,
      },
      include: {
        TransactionProducts: true,
      },
    });

    return createdTransaction;
  }

  async updateTransaction(
    transactionId: number,
    dto: TransactionDto,
  ): Promise<Transaction> {
    const { transactionProducts, ...transactionData } = dto;

    const updatedTransaction = await this.databaseService.transaction.update({
      where: { id: transactionId },
      data: {
        ...transactionData,
        TransactionProducts: transactionProducts
          ? {
              deleteMany: {},
              create: transactionProducts.map((product) => ({
                productId: product.productId,
                quantity: product.quantity,
                price: product.price,
              })),
            }
          : undefined,
      },
      include: {
        TransactionProducts: true,
      },
    });

    return updatedTransaction;
  }

  async deleteTransaction(transactionId: number): Promise<Transaction | null> {
    return this.databaseService.transaction.delete({
      where: { id: transactionId },
    });
  }
}
