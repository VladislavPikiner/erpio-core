import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../apps/backend/src/app.module';
import { PrismaService } from '../../apps/backend/src/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { TestAuthGuard } from './test-auth.guard';
import { GqlAuthGuard } from '../../apps/backend/src/auth/guards/gql-auth.guard';

async function seedDatabase(prisma: PrismaService) {
  let branchA = await prisma.branch.findFirst({ where: { name: 'branchA' } });
  if (!branchA) {
    branchA = await prisma.branch.create({ data: { name: 'branchA' } });
  }

  let user = await prisma.user.findFirst({ where: { username: 'adminA' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'adminA',
        email: 'adminA@example.com',
        password: 'password',
        roles: ['ADMIN'],
        branchId: branchA.id,
        isActive: true,
      },
    });
  }
}

export async function setupE2ETest() {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideGuard(GqlAuthGuard)
    .useValue(new TestAuthGuard())
    .compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  const prisma = moduleFixture.get(PrismaService);
  await seedDatabase(prisma);

  return { app, prisma };
}
