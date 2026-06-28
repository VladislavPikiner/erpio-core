import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/backend/src/app.module';
import { PrismaService } from '../../apps/backend/src/prisma/prisma.service';
import { beforeAll, afterAll } from 'vitest';

async function seedDatabase() {
  const prisma = new PrismaService();
  await prisma.$connect();

  // Полная очистка в правильном порядке (от зависимых к родителям)
  await prisma.saleItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.sale.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.stockMovement.deleteMany({});
  await prisma.stockTransfer.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.customer.deleteMany({});

  const branchA = await prisma.branch.create({ data: { name: 'branchA' } });
  const branchB = await prisma.branch.create({ data: { name: 'branchB' } });

  await prisma.user.create({
    data: {
      username: 'adminA',
      email: 'adminA@example.com',
      password: 'hashed',
      roles: ['ADMIN'],
      branchId: branchA.id,
      isActive: true,
    },
  });
  await prisma.user.create({
    data: {
      username: 'userB',
      email: 'userB@example.com',
      password: 'hashed',
      roles: ['CASHIER'],
      branchId: branchB.id,
      isActive: true,
    },
  });

  await prisma.product.create({ 
    data: { 
      name: 'ProductA', 
      price: 1000, 
      cost: 500,
      unit: 'pcs',
      sku: 'PROD-A'
    } 
  });
  await prisma.product.create({ 
    data: { 
      name: 'ProductB', 
      price: 2000, 
      cost: 1000,
      unit: 'pcs',
      sku: 'PROD-B'
    } 
  });

  await prisma.$disconnect();
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  await seedDatabase();
  (global as any).app = moduleRef.createNestApplication();
  await (global as any).app.init();
});

afterAll(async () => {
  if ((global as any).app) {
    await (global as any).app.close();
  }
});
