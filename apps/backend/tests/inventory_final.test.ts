import { setupE2ETest } from '../../../test/e2e/test-utils';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Inventory Resolver (Final)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const context = await setupE2ETest();
    app = context.app;
    prisma = context.prisma;
  });

  it('should return stock levels', async () => {
    const p = await prisma.product.findFirst({ where: { sku: 'PROD-A' } });
    const w = await prisma.warehouse.findFirst({ where: { name: 'branchA' } });
    
    const query = {
      query: 'query { inventory(productId: "' + p.id + '", warehouseId: "' + w.id + '") { quantity } }',
    };

    const res = await request(app.getHttpServer()).post('/graphql').send(query);
    expect(res.status).toBe(200);
    expect(res.body.data.inventory.quantity).toBeDefined();
  });

  it('should adjust stock', async () => {
    const p = await prisma.product.findFirst({ where: { sku: 'PROD-A' } });
    const w = await prisma.warehouse.findFirst({ where: { name: 'branchA' } });

    const mutation = {
      query: 'mutation { adjustStock(warehouseId: "' + w.id + '", data: { productId: "' + p.id + '", quantity: 10, type: "ADJUSTMENT" }) { quantity } }',
    };

    const res = await request(app.getHttpServer()).post('/graphql').send(mutation);
    expect(res.status).toBe(200);
    expect(res.body.data.adjustStock.quantity).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
