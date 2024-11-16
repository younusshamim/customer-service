import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
        maxRetriesPerRequest: 10,
        retryStrategy: function (times: number) {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        enableReadyCheck: false,
      },
    }),
    CustomerModule,
  ],
})
export class AppModule {}
