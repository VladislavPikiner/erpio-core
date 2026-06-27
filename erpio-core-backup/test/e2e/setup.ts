import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/backend/src/app.module';
import { PrismaService } from '../../apps/backend/src/prisma/prisma.service';

async function seedDatabase() {
  const prisma = new PrismaService();
  await prisma.$connect();

  // Reset existing mock DB state for predictability
  await prisma.sale.deleteMany({});
  await prisma.inventory.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.user.deleteMany({});

  const branchA = await prisma.branch.create({ data: { name: 'branchA' } });
  const branchB = await prisma.branch.create({ data: { name: 'branchB' } });

  await prisma.user.create({
    data: {
      email: 'adminA@example.com',
      password: 'hashed',
      role: 'ADMIN',
      branchId: branchA.id,
    },
  });
  await prisma.user.create({
    data: {
      email: 'userB@example.com',
      password: 'hashed',
      role: 'USER',
      branchId: branchB.id,
    },
  });

  await prisma.product.create({ data: { name: 'ProductA', price: 1000, branchId: branchA.id } });
  await prisma.product.create({ data: { name: 'ProductB', price: 2000, branchId: branchB.id } });

  await prisma.$disconnect();
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  await seedDatabase();
  (global as any).app = moduleRef.createNestApplication();
  await (global as any).app.init();
});

afterAll(async () => {
  await (global as any).app?.close();
});
