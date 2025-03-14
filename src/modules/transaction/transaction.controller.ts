import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  ParseIntPipe,
  Delete,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { TransactionService } from './transaction.service';
import { Transaction } from '@prisma/client';
import { TransactionDto } from './dto';
import { Public } from '@common/decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Public()
  @Get()
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

  @Public()
  @Get(':transactionId')
  async getOneTransactionById(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<Transaction | null> {
    return this.transactionService.getOneTransactionById(transactionId);
  }

  @Post()
  async createTransaction(
    @Body() transactionDto: TransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(transactionDto);
  }

  @Put(':transactionId')
  async updateTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Body() transactionDto: TransactionDto,
  ): Promise<Transaction> {
    return this.transactionService.updateTransaction(
      transactionId,
      transactionDto,
    );
  }

  @Delete(':transactionId')
  async deleteTransaction(
    @Param('transactionId', ParseIntPipe) transactionId: number,
  ): Promise<Transaction | null> {
    return this.transactionService.deleteTransaction(transactionId);
  }

  @Public()
  @Get(':transactionId/report')
  async generateTransactionReport(
    @Param('transactionId', ParseIntPipe) transactionId: number,
    @Res() res: Response,
  ) {
    const buffer =
      await this.transactionService.generateTransactionReport(transactionId);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=transaction_${transactionId}.docx`,
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );

    res.send(buffer);
  }
}
