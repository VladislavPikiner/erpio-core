import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Full Flow E2E', () => {
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

  it('creates product, receives stock, sells, and verifies DB state', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'FullProd', price: 3000 })
      .expect(201);
    const prodId = createRes.body.id;

    await request(app.getHttpServer())
      .post('/inventory/receive')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ productId: prodId, quantity: 20 })
      .expect(200);

    await request(app.getHttpServer())
      .post('/sales')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ productId: prodId, quantity: 5 })
      .expect(200);

    const inv = await request(app.getHttpServer())
      .get(`/inventory/${prodId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(inv.body).toHaveProperty('stock', 15);
  });
});
