import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Auth E2E', () => {
  let app: INestApplication;

  beforeAll(() => {
    app = (global as any).app;
  });

  it('logs in and receives JWT', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'adminA@example.com', password: 'any' })
      .expect(200);
    expect(res.body).toHaveProperty('access_token');
  });

  it('rejects requests without token', async () => {
    await request(app.getHttpServer()).get('/product').expect(401);
  });

  it('forbids USER from admin endpoint', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'userB@example.com', password: 'any' })
      .expect(200);
    const token = login.body.access_token;
    await request(app.getHttpServer())
      .post('/branch')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'newBranch' })
      .expect(403);
  });
});
