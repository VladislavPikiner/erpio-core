import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { UsersResolver } from './users.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [UsersService, UsersRepository, UsersResolver, PrismaService],
  exports: [UsersService], // Export service so other modules can use it if needed
})
export class UsersModule {}
