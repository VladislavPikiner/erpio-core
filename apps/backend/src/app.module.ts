import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customers/customer.module';
import { CategoryModule } = require('./categories/category.module');
import { ProductModule } = require('./products/product.module');
import { InventoryModule } = require('./inventory/inventory.module');
import { SaleModule } = require('./sales/sale.module');
import { FinanceModule } = require('./finance/finance.module');
import { AnalyticsModule } = require('./analytics/analytics.module');
import { WarehouseModule } = require('./warehouses/warehouse.module');
import { StockTransferModule } = require('./stock-transfers/stock-transfer.module');
import { LoggerModule } = require('./common/logger/logger.module');

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
    WarehouseModule,
    StockTransferModule,
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
