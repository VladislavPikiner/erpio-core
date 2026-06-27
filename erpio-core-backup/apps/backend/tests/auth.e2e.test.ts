import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('AuthController (E2E)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST) should return success message', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: 'testuser', password: 'password123' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  it('/auth/login (POST) should return JWT access token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'password' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');

    const token = response.body.access_token;
    const jwtPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    expect(jwtPayload).toHaveProperty('username', 'admin');
  });

  it('/auth/login (POST) should return Unauthorized for invalid credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'admin', password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body.error).toHaveProperty('message', 'Invalid credentials');
  });

  afterAll(async () => {
    await app.close();
  });
});
