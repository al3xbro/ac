import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcStatus } from './ac-status.entity.js';
import { AcStatusController } from './ac-status.controller.js';
import { AcStatusService } from './ac-status.service.js';
import { PushSubscriptionModule } from '../push-subscription/push-subscription.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([AcStatus]), PushSubscriptionModule],
  controllers: [AcStatusController],
  providers: [AcStatusService],
})
export class AcStatusModule {}
