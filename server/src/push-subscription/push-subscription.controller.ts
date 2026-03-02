import { Controller, Post, Body } from '@nestjs/common';
import { PushSubscriptionService } from './push-subscription.service.js';
import { CreatePushSubscriptionDto } from './dto/create-push-subscription.dto.js';

@Controller('push-subscription')
export class PushSubscriptionController {
  constructor(private readonly pushSubscriptionService: PushSubscriptionService) {}

  @Post()
  async subscribe(@Body() dto: CreatePushSubscriptionDto) {
    return this.pushSubscriptionService.subscribe(dto);
  }

  @Post('unsubscribe')
  async unsubscribe(@Body('endpoint') endpoint: string) {
    await this.pushSubscriptionService.unsubscribe(endpoint);
    return { success: true };
  }
}
