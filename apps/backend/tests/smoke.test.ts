import { describe, it, expect } from 'vitest';
import { setupE2ETest } from '../../../test/e2e/test-utils';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('Diagnostic Smoke Test', () => {
  it('should import supertest and nest application', async () => {
    const { app } = await setupE2ETest();
    expect(app).toBeInstanceOf(INestApplication);
    
    // Проверяем, что supertest работает
    const res = await request(app.getHttpServer()).get('/');
    expect(res.status).toBeDefined();
    
    await app.close();
  });
});
