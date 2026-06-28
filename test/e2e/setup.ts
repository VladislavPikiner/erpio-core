import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/backend/src/app.module';
import { PrismaService } from '../../apps/backend/src/prisma/prisma.service';
import { beforeAll, afterAll } from 'vitest';

async function seedDatabase() {
  // Use a fresh PrismaClient to ensure it picks up the latest schema from the reset database
  const prisma = new PrismaService();
  await prisma.$connect();
  
  // Wait a moment for Prisma to recognize the schema change if necessary
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('🌱 Seeding database...');

  const branchA = await prisma.branch.create({ data: { name: 'branchA' } });
  const branchB = await prisma.branch.create({ data: { name: 'branchB' } });

  await prisma.user.upsert({
    where: { username: 'adminA' },
    update: {},
    create: {
      username: 'adminA',
      email: 'adminA@example.com',
      password: 'hashed',
      roles: ['ADMIN'],
      branchId: branchA.id,
      isActive: true,
    },
  });
  await prisma.user.upsert({
    where: { username: 'userB' },
    update: {},
    create: {
      username: 'userB',
      email: 'userB@example.com',
      password: 'hashed',
      roles: ['CASHIER'],
      branchId: branchB.id,
      isActive: true,
    },
  });

  await prisma.product.upsert({
    where: { sku: 'PROD-A' },
    update: {},
    create: { 
      name: 'ProductA', 
      price: 1000, 
      cost: 500,
      unit: 'pcs',
      sku: 'PROD-A'
    } 
  });
  await prisma.product.upsert({
    where: { sku: 'PROD-B' },
    update: {},
    create: { 
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
  process.env.DATABASE_URL = "postgresql://postgres:password@localhost:5433/erpio_db?schema=public";
  process.env.JWT_SECRET = "super-secret-enterprise-key";
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
