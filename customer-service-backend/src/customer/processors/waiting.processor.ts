import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CustomerGateway } from '../customer.gateway';
import { CustomerService } from '../customer.service';

@Processor('waiting-queue')
export class WaitingProcessor {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerGateway: CustomerGateway,
  ) {}

  @Process('wait-customer')
  async handleWaitingTime(job: Job<{ customerId: string }>) {
    const { customerId } = job.data;
    const customer =
      await this.customerService.assignRepresentative(customerId);
    if (customer) {
      this.customerGateway.emitCustomerUpdate(customerId, customer);
    }
  }
}
