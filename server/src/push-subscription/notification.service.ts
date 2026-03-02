import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webPush from 'web-push';
import { PushSubscriptionService } from './push-subscription.service.js';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly pushSubscriptionService: PushSubscriptionService,
  ) {
    webPush.setVapidDetails(
      this.configService.get<string>('VAPID_SUBJECT', 'mailto:admin@example.com'),
      this.configService.get<string>('VAPID_PUBLIC_KEY', ''),
      this.configService.get<string>('VAPID_PRIVATE_KEY', ''),
    );
  }

  async notifyAll(payload: { title: string; body: string }): Promise<void> {
    const subscriptions = await this.pushSubscriptionService.getAll();

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        ),
      ),
    );

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'rejected') {
        const statusCode = result.reason?.statusCode;
        if (statusCode === 410 || statusCode === 404) {
          this.logger.warn(`Removing expired subscription: ${subscriptions[i].endpoint}`);
          await this.pushSubscriptionService.remove(subscriptions[i].id);
        } else {
          this.logger.error(`Failed to send notification: ${result.reason}`);
        }
      }
    }
  }
}
