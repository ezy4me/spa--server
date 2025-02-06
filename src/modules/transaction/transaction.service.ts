import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Transaction } from '@prisma/client';
import { TransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllTransactions(): Promise<Transaction[]> {
    return this.databaseService.transaction.findMany();
  }

  async getOneTransactionById(
    transactionId: number,
  ): Promise<Transaction | null> {
    return this.databaseService.transaction.findUnique({
      where: { id: transactionId },
    });
  }

  async createTransaction(dto: TransactionDto): Promise<Transaction> {
    return this.databaseService.transaction.create({
      data: {
        ...dto,
      },
    });
  }

  async updateTransaction(
    transactionId: number,
    dto: TransactionDto,
  ): Promise<Transaction> {
    return this.databaseService.transaction.update({
      where: { id: transactionId },
      data: dto,
    });
  }

  async deleteTransaction(transactionId: number): Promise<Transaction | null> {
    return this.databaseService.transaction.delete({
      where: { id: transactionId },
    });
  }
}
