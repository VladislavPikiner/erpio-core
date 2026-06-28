import { Test } from '@nestjs/testing';
import { AppModule } from '../../apps/backend/src/app.module';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function setupNestApp() {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = moduleRef.createNestApplication();
  await app.init();
  // Устанавливаем глобальную переменную, чтобы тесты могли ее использовать
  (global as any).app = app;
}

export default async function globalSetup() {
  console.log('Running globalSetup...');
  await setupNestApp();
  console.log('globalSetup finished. Nest application initialized.');
}
