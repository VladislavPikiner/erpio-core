import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { GqlAuthGuard } from '../src/auth/guards/gql-auth.guard';
import { TestAuthGuard } from '../../test/e2e/test-auth.guard';

describe('Inventory Resolver (E2E - Jest)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue(new TestAuthGuard())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get(PrismaService);
    
    // Сидинг
    const branchA = await prisma.branch.upsert({
      where: { name: 'branchA' },
      update: {},
      create: { name: 'branchA' },
    });
    await prisma.user.upsert({
      where: { username: 'adminA' },
      update: {},
      create: {
        username: 'adminA',
        email: 'adminA@example.com',
        password: 'password',
        roles: ['ADMIN'],
        branchId: branchA.id,
        isActive: true,
      },
    });
    await prisma.product.upsert({
      where: { sku: 'PROD-A' },
      update: {},
      create: { name: 'ProductA', price: 1000, cost: 500, unit: 'pcs', sku: 'PROD-A' }
    });
  });

  it('should return stock levels', async () => {
    const p = await prisma.product.findFirst({ where: { sku: 'PROD-A' } });
    const w = await prisma.warehouse.findFirst({ where: { name: 'branchA' } });
    
    const query = {
      query: `query { inventory(productId: "${p.id}", warehouseId: "${w.id}") { quantity } }`,
    };

    const res = await request(app.getHttpServer()).post('/graphql').send(query);
    expect(res.status).toBe(200);
    expect(res.body.data.inventory.quantity).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
