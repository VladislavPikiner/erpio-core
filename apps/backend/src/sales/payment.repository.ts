import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Payment } from '@prisma/client';
import { uuidv7 } from '../common/utils/uuid';

interface CreatePaymentData {
  saleId: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'TRANSFER';
  reference?: string | null;
}

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePaymentData): Promise<Payment> {
    return this.prisma.payment.create({
      data: {
        id: uuidv7(),
        saleId: data.saleId,
        amount: data.amount,
        method: data.method,
        reference: data.reference ?? null,
        status: 'COMPLETED',
      },
    });
  }

  findBySaleId(saleId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { saleId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
