import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bull';
import { v4 as uuidv4 } from 'uuid';
import { REPRESENTATIVES } from '../config/constants';
import { Customer, Representative } from '../types/customer.types';

@Injectable()
export class CustomerService implements OnModuleInit {
  private representatives: Representative[] = REPRESENTATIVES;
  private customers: Map<string, Customer> = new Map();
  private redisConnected = false;

  constructor(
    @InjectQueue('waiting-queue') private waitingQueue: Queue,
    @InjectQueue('service-queue') private serviceQueue: Queue,
  ) {}

  async onModuleInit() {
    try {
      await this.waitingQueue.isReady();
      this.redisConnected = true;
      console.log('Successfully connected to Redis');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      this.redisConnected = false;
    }
  }

  async createCustomer(name: string): Promise<Customer> {
    const id = uuidv4();
    const token = Math.random().toString(36).substring(7).toUpperCase();
    const waitTime = Math.floor(Math.random() * (15 - 5 + 1) + 5);

    const customer: Customer = {
      id,
      name,
      status: 'waiting',
      token,
      waitTime,
    };

    this.customers.set(id, customer);

    if (this.redisConnected) {
      try {
        await this.waitingQueue.add(
          'wait-customer',
          { customerId: id },
          { delay: waitTime * 1000 },
        );
      } catch (error) {
        console.error('Failed to add to queue:', error);
        setTimeout(() => this.assignRepresentative(id), waitTime * 1000);
      }
    } else {
      setTimeout(() => this.assignRepresentative(id), waitTime * 1000);
    }

    return customer;
  }

  async assignRepresentative(customerId: string): Promise<Customer | null> {
    const customer = this.customers.get(customerId);
    if (!customer) return null;

    const availableRep = this.representatives.find((rep) => rep.available);
    if (!availableRep) return null;

    availableRep.available = false;
    customer.status = 'serving';
    customer.representative = availableRep.name;
    this.customers.set(customerId, customer);

    if (this.redisConnected) {
      try {
        await this.serviceQueue.add(
          'serve-customer',
          { customerId, representativeName: availableRep.name },
          { delay: 10000 },
        );
      } catch (error) {
        console.error('Failed to add to service queue:', error);
        setTimeout(
          () => this.completeService(customerId, availableRep.name),
          10000,
        );
      }
    } else {
      setTimeout(
        () => this.completeService(customerId, availableRep.name),
        10000,
      );
    }

    return customer;
  }

  completeService(customerId: string, representativeName: string): void {
    const customer = this.customers.get(customerId);
    if (!customer) return;

    customer.status = 'completed';
    customer.representative = undefined;
    this.customers.set(customerId, customer);

    const representative = this.representatives.find(
      (rep) => rep.name === representativeName,
    );
    if (representative) {
      representative.available = true;
    }
  }

  getCustomer(id: string): Customer | undefined {
    return this.customers.get(id);
  }

  getAllCustomers(): Customer[] {
    return Array.from(this.customers.values());
  }
}
