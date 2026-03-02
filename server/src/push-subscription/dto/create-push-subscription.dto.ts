export class CreatePushSubscriptionDto {
  endpoint!: string;
  keys!: {
    p256dh: string;
    auth: string;
  };
}
