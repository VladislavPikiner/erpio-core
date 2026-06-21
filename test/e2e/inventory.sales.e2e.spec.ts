import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Inventory & Sales E2E', () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    app = (global as any).app;
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'adminA@example.com', password: 'any' })
      .expect(200);
    adminToken = login.body.access_token;
  });

  it('receives stock and updates inventory', async () => {
    const receive = await request(app.getHttpServer())
      .post('/inventory/receive')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ productId: 1, quantity: 10 })
      .expect(200);
    expect(receive.body).toHaveProperty('stock', 10);
  });

  it('sells stock and decrements inventory', async () => {
    const sale = await request(app.getHttpServer())
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ productId: 1, quantity: 3 })
      .expect(200);
    expect(sale.body).toHaveProperty('remainingStock', 7);
  });

  it('rejects sale when insufficient stock', async () => {
    await request(app.getHttpServer())
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ productId: 1, quantity: 100 })
      .expect(400);
  });

  it('validates input with Zod – missing productId', async () => {
    await request(app.getHttpServer())
      .post('/inventory/receive')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 5 })
      .expect(400);
  });
});
