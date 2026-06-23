import { Module, Logger } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from './sentry/sentry.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
// import { UserModule } from './user/user.module'; // Old import
import { UsersModule } from './users/users.module'; // New import
import { HealthModule } from './health/health.module';
import { CustomerModule } from './customers/customer.module';
// import { CategoryModule } = require('./categories/category.module'); // Old import
import { CategoryModule } from './categories/category.module'; // Corrected import
// import { ProductModule } = require('./products/product.module'); // Old import
import { ProductModule } from './products/product.module'; // Corrected import
// import { InventoryModule } = require('./inventory/inventory.module'); // Old import
import { InventoryModule } from './inventory/inventory.module'; // Corrected import
// import { SaleModule } = require('./sales/sale.module'); // Old import
import { SaleModule } from './sales/sale.module'; // Corrected import
// import { FinanceModule } = require('./finance/finance.module'); // Old import
import { FinanceModule } from './finance/finance.module'; // Corrected import
// import { AnalyticsModule } = require('./analytics/analytics.module'); // Old import
import { AnalyticsModule } from './analytics/analytics.module'; // Corrected import
// import { WarehouseModule } = require('./warehouses/warehouse.module'); // Old import
import { WarehouseModule } from './warehouses/warehouse.module'; // Corrected import
// import { StockTransferModule } = require('./stock-transfers/stock-transfer.module'); // Old import
import { StockTransferModule } from './stock-transfers/stock-transfer.module'; // Corrected import
// import { LoggerModule } = require('./common/logger/logger.module'); // Old import
import { LoggerModule } from './common/logger/logger.module'; // Corrected import

@Module({
  imports: [
    SentryModule,
    PrismaModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TerminusModule,
    AuthModule,
    // UserModule, // Remove old import
    UsersModule, // Add new import
    HealthModule,
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
