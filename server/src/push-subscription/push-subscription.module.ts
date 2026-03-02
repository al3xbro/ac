import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PushSubscription } from './push-subscription.entity.js';
import { PushSubscriptionController } from './push-subscription.controller.js';
import { PushSubscriptionService } from './push-subscription.service.js';
import { NotificationService } from './notification.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PushSubscription]), ConfigModule],
  controllers: [PushSubscriptionController],
  providers: [PushSubscriptionService, NotificationService],
  exports: [NotificationService],
})
export class PushSubscriptionModule {}
