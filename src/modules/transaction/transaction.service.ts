import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@database/database.service';
import { Transaction } from '@prisma/client';
import { TransactionDto } from './dto';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
} from 'docx';

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

    return this.databaseService.transaction.create({
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
  }

  async updateTransaction(
    transactionId: number,
    dto: TransactionDto,
  ): Promise<Transaction> {
    const { transactionProducts, ...transactionData } = dto;

    return this.databaseService.transaction.update({
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
  }

  async deleteTransaction(transactionId: number): Promise<Transaction | null> {
    return this.databaseService.transaction.delete({
      where: { id: transactionId },
    });
  }

  async generateTransactionReport(transactionId: number): Promise<Buffer> {
    const transaction = await this.databaseService.transaction.findUnique({
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

    if (!transaction) {
      throw new NotFoundException('Транзакция не найдена');
    }

    const totalAmount = transaction.TransactionProducts.reduce(
      (sum, tp) => sum + tp.quantity * tp.price,
      0,
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Заголовок отчета
            new Paragraph({
              children: [
                new TextRun({
                  text: `Отчет по транзакции №${transaction.id}`,
                  bold: true,
                  font: 'Arial',
                  size: 32,
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200, line: 200 }, // Устанавливаем междустрочный интервал 200
            }),

            // Дата, клиент, метод оплаты и другие данные
            new Paragraph({
              children: [
                new TextRun({
                  text: `Дата транзакции: ${transaction.date.toISOString().split('T')[0]}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 }, // Междустрочный интервал 200
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Клиент: ${transaction.client?.fullName || 'Неизвестно'}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Телефон клиента: ${transaction.client?.phone || 'Не указан'}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Метод оплаты: ${transaction.paymentMethod}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Тип транзакции: ${transaction.type}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            // Продукты в транзакции
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Продукты в транзакции:',
                  bold: true,
                  font: 'Arial',
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200, line: 200 },
            }),

            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                // Заголовок таблицы
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Название',
                              font: 'Arial',
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER, // Выравнивание по центру
                          spacing: { after: 100 }, // Отступ после текста
                        }),
                      ],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Количество',
                              font: 'Arial',
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 100 },
                        }),
                      ],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Цена за единицу',
                              font: 'Arial',
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 100 },
                        }),
                      ],
                      width: { size: 20, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'Сумма',
                              font: 'Arial',
                              size: 24,
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                          spacing: { after: 100 },
                        }),
                      ],
                      width: { size: 30, type: WidthType.PERCENTAGE },
                    }),
                  ],
                }),
                // Продукты
                ...transaction.TransactionProducts.map(
                  (tp) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: tp.product.name,
                                  font: 'Arial',
                                  size: 24,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                              spacing: { after: 100 }, // Отступ после текста
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: tp.quantity.toString(),
                                  font: 'Arial',
                                  size: 24,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                              spacing: { after: 100 },
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `${tp.price.toFixed(2)} ₽`,
                                  font: 'Arial',
                                  size: 24,
                                }),
                              ],
                              alignment: AlignmentType.CENTER,
                              spacing: { after: 100 },
                            }),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: `${(tp.quantity * tp.price).toFixed(2)} ₽`,
                                  font: 'Arial',
                                  size: 24,
                                }),
                              ],
                              spacing: { after: 100 },
                            }),
                          ],
                        }),
                      ],
                    }),
                ),
              ],
            }),

            // Общая сумма
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Общая сумма:',
                  bold: true,
                  font: 'Arial',
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200, line: 200, before: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `${totalAmount.toFixed(2)} ₽`,
                  bold: true,
                  font: 'Arial',
                  size: 28,
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            // Дополнительная информация
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Дополнительная информация:',
                  bold: true,
                  font: 'Arial',
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Комментарий клиента: ${transaction.client?.comment || 'Отсутствует'}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            // Детали транзакции
            new Paragraph({
              children: [
                new TextRun({
                  text: 'Детали транзакции:',
                  bold: true,
                  font: 'Arial',
                  size: 24,
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `ID транзакции: ${transaction.id}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Название: ${transaction.name}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Тип: ${transaction.type}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Метод оплаты: ${transaction.paymentMethod}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Дата: ${transaction.date.toISOString().split('T')[0]}`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `Общая сумма: ${totalAmount.toFixed(2)} ₽`,
                  font: 'Arial',
                }),
              ],
              alignment: AlignmentType.LEFT,
              spacing: { after: 200, line: 200 },
            }),
          ],
        },
      ],
    });

    return Packer.toBuffer(doc);
  }
}
