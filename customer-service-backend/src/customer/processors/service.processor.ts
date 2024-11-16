import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CustomerGateway } from '../customer.gateway';
import { CustomerService } from '../customer.service';

@Processor('service-queue')
export class ServiceProcessor {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerGateway: CustomerGateway,
  ) {}

  @Process('serve-customer')
  async handleServiceTime(
    job: Job<{ customerId: string; representativeName: string }>,
  ) {
    const { customerId, representativeName } = job.data;
    this.customerService.completeService(customerId, representativeName);
    const customer = this.customerService.getCustomer(customerId);
    if (customer) {
      this.customerGateway.emitCustomerUpdate(customerId, customer);
    }
  }
}
