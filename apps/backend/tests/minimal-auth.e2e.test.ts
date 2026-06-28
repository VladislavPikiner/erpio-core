import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController (Minimal E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) should not return 404 in isolation', async () => {
    console.log('Attempting to POST /auth/login in minimal setup...');
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' });
      
    console.log('Response status:', response.status);
    console.log('Response body:', response.body);

    expect(response.status).not.toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
