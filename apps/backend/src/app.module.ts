import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customers/customer.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { InventoryModule } from './inventory/inventory.module';
import { SaleModule } from './sales/sale.module';
import { FinanceModule } from './finance/finance.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    CustomerModule,
    CategoryModule,
    ProductModule,
    InventoryModule,
    SaleModule,
    FinanceModule,
    AnalyticsModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
      },
    }),
  ],
  providers: [Logger],
})
export class AppModule {}
