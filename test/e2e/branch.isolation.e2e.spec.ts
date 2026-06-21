import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Branch Isolation E2E', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    app = (global as any).app;
    const adminLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'adminA@example.com', password: 'any' })
      .expect(200);
    adminToken = adminLogin.body.access_token;

    const userLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'userB@example.com', password: 'any' })
      .expect(200);
    userToken = userLogin.body.access_token;
  });

  it('admin creates product visible only in its branch', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ProdA2', price: 1500 })
      .expect(201);
    const prodId = createRes.body.id;

    // User from other branch must not be able to access the product
    await request(app.getHttpServer())
      .get(`/product/${prodId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('user cannot update product from another branch', async () => {
    const prodRes = await request(app.getHttpServer())
      .post('/product')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'ProdA3', price: 2000 })
      .expect(201);
    const prodId = prodRes.body.id;

    await request(app.getHttpServer())
      .patch(`/product/${prodId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 2500 })
      .expect(403);
  });
});
