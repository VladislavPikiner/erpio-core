import { Module, Global } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Global()
@Module({
  providers: [
    {
      provide: 'SENTRY_INSTANCE',
      useFactory: () => {
        return Sentry.init({
          dsn: process.env.SENTRY_DSN,
          tracesSampleRate: 1.0,
        });
      },
    },
  ],
  exports: ['SENTRY_INSTANCE'],
})
export class SentryModule {}
