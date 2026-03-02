import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PushSubscription } from './push-subscription.entity.js';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto.js';

@Injectable()
export class PushSubscriptionService {
  constructor(
    @InjectRepository(PushSubscription)
    private readonly repo: Repository<PushSubscription>,
  ) {}

  async subscribe(dto: CreatePushSubscriptionDto): Promise<PushSubscription> {
    const existing = await this.repo.findOne({
      where: { endpoint: dto.endpoint },
    });
    if (existing) return existing;

    const sub = this.repo.create({
      endpoint: dto.endpoint,
      p256dh: dto.keys.p256dh,
      auth: dto.keys.auth,
    });
    return this.repo.save(sub);
  }

  async unsubscribe(endpoint: string): Promise<void> {
    await this.repo.delete({ endpoint });
  }

  async getAll(): Promise<PushSubscription[]> {
    return this.repo.find();
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
