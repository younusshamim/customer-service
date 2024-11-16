import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerGateway } from './customer.gateway';
import { CustomerService } from './customer.service';
import { ServiceProcessor } from './processors/service.processor';
import { WaitingProcessor } from './processors/waiting.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'waiting-queue',
      },
      {
        name: 'service-queue',
      },
    ),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    CustomerGateway,
    WaitingProcessor,
    ServiceProcessor,
  ],
})
export class CustomerModule {}
